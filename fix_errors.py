import re

# Fix HearBot.tsx
with open('src/components/HearBot.tsx', 'r') as f:
    hb = f.read()

hb = hb.replace("I\\'m sorry, I couldn\\'t process that.", "I'm sorry, I couldn't process that.")
hb = hb.replace("catch (err: any)", "catch (err: unknown)")
hb = hb.replace("if (err.message === 'MISSING_API_KEY')", "if (err instanceof Error && err.message === 'MISSING_API_KEY')")
hb = hb.replace("${err.message || 'Unknown network error'}", "${err instanceof Error ? err.message : 'Unknown network error'}")

with open('src/components/HearBot.tsx', 'w') as f:
    f.write(hb)

# Fix Dashboard.tsx
with open('src/pages/Dashboard.tsx', 'r') as f:
    db = f.read()

db = db.replace("icon: any;", "icon: React.ElementType;")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(db)
