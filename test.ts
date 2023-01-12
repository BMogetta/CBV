function main(data: string) {

  console.log("-------------------------------------")
  console.log("data")
console.log(data)
console.log(typeof data)

  // LABELS
const issue_labels = JSON.parse(data);
console.log("-------------------------------------")
  console.log("parse stringify data")
console.log(issue_labels)
console.log(typeof issue_labels)
const is_accepted = issue_labels.find( a => a.name == "Accepted" )
console.log("-------------------------------------")
  console.log("is accepted")
console.log(is_accepted)
console.log(typeof is_accepted)
if (!is_accepted) {
  // Because this exit here, no changes are made, and no code is ever pushed
  console.log("-------------------------------------")
  console.log("IF STATEMENT")
  Deno.exit(0)
}
console.log("-------------------------------------")
console.log("IF NOT ENTERED")
}



const data = `
[
  {
    "color": "0075ca",
    "default": true,
    "description": "Improvements or additions to documentation",
    "id": 4985150721,
    "name": "documentation",
    "node_id": "LA_kwDOIvaxfc8AAAABKSNdAQ",
    "url": "https://api.github.com/repos/BMogetta/CBV/labels/documentation"
  },
  {
    "color": "a2eeef",
    "default": true,
    "description": "New feature or request",
    "id": 4985150739,
    "name": "enhancement",
    "node_id": "LA_kwDOIvaxfc8AAAABKSNdEw",
    "url": "https://api.github.com/repos/BMogetta/CBV/labels/enhancement"
  },
  {
    "color": "29E299",
    "default": false,
    "description": "This issue was accepted as a valid CBV",
    "id": 4985400423,
    "name": "Accepted",
    "node_id": "LA_kwDOIvaxfc8AAAABKScsZw",
    "url": "https://api.github.com/repos/BMogetta/CBV/labels/Accepted"
  }
]
`

main(data)