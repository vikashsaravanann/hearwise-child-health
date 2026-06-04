import os
import re

pages = [
    "AboutPage.tsx",
    "Audiologists.tsx",
    "Blog.tsx",
    "BlogPost.tsx",
    "ExplorePage.tsx",
    "HearingHealthPage.tsx",
    "LearningHubPage.tsx",
    "SchoolOnboarding.tsx",
    "TeacherTraining.tsx",
    "Waitlist.tsx"
]

base_dir = "src/pages"

for page in pages:
    path = os.path.join(base_dir, page)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r') as f:
        content = f.read()

    # Skip if already added
    if 'import BackButton' in content:
        print(f"Skipping {page}, BackButton already imported")
        continue

    # Add import
    content = "import BackButton from '../components/BackButton';\n" + content

    # Find `return (` for the main component.
    # Usually it's `return (` or `return (\n`
    # We will look for `export default function` to find the main component,
    # then find the first `return (` inside it.
    
    # We want to insert <BackButton /> right after the first <...> or <> inside return (
    
    # Let's find `return (`
    return_match = re.search(r'return\s*\(\s*(<[a-zA-Z]+[^>]*>|<>|<div>)', content)
    if return_match:
        tag = return_match.group(1)
        # If it's a tag with className, we add pt-20
        new_tag = tag
        if 'className="' in new_tag:
            # Check if pt-20 is not there
            if 'pt-20' not in new_tag:
                new_tag = new_tag.replace('className="', 'className="pt-20 ')
        elif tag.startswith('<div'):
            # no className, add it
            new_tag = new_tag.replace('<div', '<div className="pt-20"')
            
        replacement = f"return (\n    <>\n      <BackButton />\n      {new_tag}"
        if tag == '<>':
            # It already has a fragment, just insert inside it
            replacement = f"return (\n    <>\n      <BackButton />"
        else:
            # Wrap in fragment and insert <BackButton />, then the tag
            # Wait, if we wrap in fragment, we have to close it at the end.
            # That's hard to do cleanly with regex.
            # Instead, since we just need it at the top, if the root is a div, we can just put it inside the div!
            replacement = f"return (\n    {new_tag}\n      <BackButton />"
            if tag == '<>':
                replacement = f"return (\n    <>\n      <BackButton />"

        # Special case: Audiologists.tsx starts with `<>` at root
        if tag == '<>':
            # find next div to add pt-20? The user said "add pt-20 to the top of each page's main content div".
            # If the root is <>, the next tag is probably a div. Let's just do a naive replace of the first `className="` with `className="pt-20 ` after the return
            pass
            
    # Simpler and safer way without parsing AST:
    # 1. Add import
    # 2. Insert `<BackButton />` after the first occurrence of `return (` followed by `<>` or `<div...>`
    
    parts = content.split('return (')
    if len(parts) > 1:
        # The main return is usually the last one or the one after `export default function`
        # Let's find the one after `export default function`
        match = re.search(r'export default function.*?return\s*\(', content, flags=re.DOTALL)
        if match:
            pre_return = content[:match.end()]
            post_return = content[match.end():]
            
            # Now find the first tag
            tag_match = re.match(r'\s*(<>|<[a-zA-Z]+[^>]*>)', post_return)
            if tag_match:
                tag = tag_match.group(1)
                new_tag = tag
                if 'className="' in new_tag and 'pt-20' not in new_tag:
                    new_tag = new_tag.replace('className="', 'className="pt-20 ')
                elif tag.startswith('<div') and 'className=' not in tag:
                    new_tag = new_tag.replace('<div', '<div className="pt-20"')
                
                rest = post_return[tag_match.end():]
                
                if tag == '<>':
                    # It's a fragment, put BackButton right after
                    new_post_return = f"\n    <>\n      <BackButton />" + rest
                    # Find the first div after <> to add pt-20
                    new_post_return = re.sub(r'(<div[^>]*className=")', r'\1pt-20 ', new_post_return, count=1)
                else:
                    # It's a regular tag, put BackButton right inside it
                    new_post_return = f"\n    {new_tag}\n      <BackButton />" + rest
                    
                content = pre_return + new_post_return

    with open(path, 'w') as f:
        f.write(content)
    print(f"Updated {page}")

