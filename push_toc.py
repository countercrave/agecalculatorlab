"""Push articles-sync-out as ONE branch/PR. FIXED ordering: root tree built LAST.
Parallel blob + tree uploads (8 workers). Verifies every blob sha locally."""
import sys, os, base64, hashlib
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, '/home/hatch/workspace/custom-connectors/custom.github-api/bin')
import gh_api

STAGED = 'homepage-toc-fix'
BRANCH = 'kavi/homepage-one-toc'
MAXW = 8

def blob_sha(data: bytes) -> str:
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()

st, ref = gh_api.api('GET', '/git/ref/heads/main')
base = ref['object']['sha']
print('main base:', base)
print('base ok')
st, base_tree = gh_api.api('GET', f'/git/trees/{base}?recursive=1')
base_entries = {}  # dir -> {name: (type, sha)}
base_files = {}
for t in base_tree['tree']:
    if t['type'] == 'blob':
        base_files[t['path']] = t['sha']
    else:
        base_entries.setdefault(os.path.dirname(t['path']), {})[os.path.basename(t['path'])] = ('tree', t['sha'])
print('base blobs:', len(base_files))

staged = {}
for root, dirs, fs in os.walk(STAGED):
    for f in fs:
        p = os.path.join(root, f)
        staged[os.path.relpath(p, STAGED)] = open(p, 'rb').read()
print('staged files:', len(staged))

def upload(item):
    rel, data = item
    enc = 'base64' if rel.endswith('.webp') else 'utf-8'
    content = base64.b64encode(data).decode() if enc == 'base64' else data.decode('utf-8')
    st, r = gh_api.api('POST', '/git/blobs', {'content': content, 'encoding': enc})
    assert r['sha'] == blob_sha(data), f'blob sha mismatch {rel}'
    return rel, r['sha']
with ThreadPoolExecutor(max_workers=MAXW) as ex:
    blob_shas = dict(ex.map(upload, staged.items()))
print('blobs uploaded + verified:', len(blob_shas))

files = dict(base_files); files.update(blob_shas)
changed_dirs = set()
for rel in staged:
    d = os.path.dirname(rel)
    while d:
        changed_dirs.add(d); d = os.path.dirname(d)
changed_dirs.add('')
# ORDER: deepest first, ROOT EXPLICITLY LAST (the PR #123 bug was root sorting with depth-0)
ordered = sorted([d for d in changed_dirs if d != ''], key=lambda d: d.count('/'), reverse=True) + ['']
dir_tree_sha = {}
def build_tree(d):
    ents = []
    for path, sha in files.items():
        if os.path.dirname(path) == d:
            ents.append({'path': os.path.basename(path), 'mode': '100644', 'type': 'blob', 'sha': sha})
    subs = set()
    for path in files:
        dd = os.path.dirname(path)
        while dd and dd != d:
            parent = os.path.dirname(dd)
            if parent == d:
                subs.add(dd); break
            dd = parent
    for sd in sorted(subs):
        sha = dir_tree_sha.get(sd) or base_entries.get(d, {}).get(os.path.basename(sd), (None, None))[1]
        assert sha, f'missing subdir sha {sd}'
        ents.append({'path': os.path.basename(sd), 'mode': '040000', 'type': 'tree', 'sha': sha})
    if d == '':
        have = {e['path'] for e in ents}
        for path, sha in base_files.items():
            if '/' not in path and path not in have:
                ents.append({'path': path, 'mode': '100644', 'type': 'blob', 'sha': sha})
        for name, (typ, sha) in base_entries.get('', {}).items():
            if name not in have:
                ents.append({'path': name, 'mode': '040000', 'type': 'tree', 'sha': sha})
    st, tr = gh_api.api('POST', '/git/trees', {'tree': ents})
    return d, tr['sha']
import itertools
# process level by level (same depth in parallel; a level's trees only depend on deeper levels)
levels = {}
for d in ordered:
    levels.setdefault(d.count('/') if d else -1, []).append(d)
for depth in sorted(levels, reverse=True):
    lvl = levels[depth]
    with ThreadPoolExecutor(max_workers=MAXW) as ex:
        for d, sha in ex.map(build_tree, lvl):
            dir_tree_sha[d] = sha
    print(f'level depth {depth}: {len(lvl)} trees done; root last = {"" in lvl}')
print('root tree:', dir_tree_sha[''])
try:
    st, r = gh_api.api('POST', '/git/refs', {'ref': f'refs/heads/{BRANCH}', 'sha': base})
    print('branch:', st)
except RuntimeError as ex:
    assert 'already exists' in str(ex); print('branch exists')
st, cm = gh_api.api('POST', '/git/commits', {
    'message': """Homepage: remove the duplicate Table of Contents

The homepage carried two tables of contents listing the same sections:
the sticky switcher bar (labelled "Table of Contents") and the "Guide
Navigation" sidebar (aside.tool-toc, 10 numbered links). This PR removes
the sidebar and keeps the switcher, which is the persistent navigation
(sticky, visible anywhere on the long page, back-to-calculator button,
active-section highlighting).

Changes to index.html only:
1) Removed the aside.tool-toc element.
2) The sidebar occupied a 280px grid track, so the desktop
.tool-content-layout rule goes from 280px 1fr to 1fr, and the article is
centred in the single column (margin-inline:auto). The author band's
unrelated 280px 1fr rule is untouched.
3) Switcher tabs: removed the "Contents" tab (it pointed at the removed
sidebar) and added an "FAQs" tab after "Formulas" (page order), so the
FAQ section keeps its in-page link — it was previously linked only from
the sidebar. Tab count stays at 10; the #page-contents section itself
and all its article content are untouched.""",
    'tree': dir_tree_sha[''], 'parents': [base]})
st, u = gh_api.api('PATCH', f'/git/refs/heads/{BRANCH}', {'sha': cm['sha'], 'force': False})
print('branch updated:', st)
import time
for attempt in range(3):
    st, pr = gh_api.api('POST', '/pulls', {
        'title': 'Homepage: remove duplicate Table of Contents (keep sticky switcher)',
        'head': BRANCH, 'base': 'main',
        'body': """The homepage had two tables of contents listing the same sections: the sticky switcher bar and the "Guide Navigation" sidebar. This PR removes the sidebar and keeps the switcher (persistent, with back-to-calculator and active-section highlighting).

Changes (index.html only):
- Sidebar "Guide Navigation" box removed.
- Desktop article layout goes from a 280px sidebar + article grid to a single centered article column (the author band's separate 280px rule is untouched).
- Switcher tabs: "Contents" tab removed (it pointed at the removed sidebar); "FAQs" tab added after "Formulas" so the FAQ section keeps its in-page link. Tab count stays at 10.
- The #page-contents section and all its article content are untouched.

Verify after merge: the homepage shows no "Guide Navigation" sidebar box, the article reads in a single centered column, and the switcher bar shows an FAQs tab with no Contents tab."""})
    if st in (200, 201):
        print('VISUALS PR:', pr['number'], pr['html_url']); break
    print('PR create status', st); time.sleep(20)
