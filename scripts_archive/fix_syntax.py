with open("index.html", "r") as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if line.strip() == "if (pass !== passConfirm) {":
        skip = True
    
    if skip:
        # Stop skipping when we hit the start of checkCurrentAuth
        if line.startswith("    async function checkCurrentAuth()"):
            skip = False
            out.append(line)
    else:
        out.append(line)

with open("index.html", "w") as f:
    f.writelines(out)
print("Removed broken syntax block")
