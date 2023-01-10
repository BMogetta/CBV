import { createHash } from "https://deno.land/std@0.66.0/hash/mod.ts";
const data_given_by_gh: string[] = Deno.args;
/*
* First argument is going to be an object containing the new CBV to be added
* Second argument is the API v1 GraphQL endpoint to store the CBV
* Third argument is going to be a Key to validate the store endpoint
*/

main(data_given_by_gh)

async function main(args: string[]) {

  const hashed_api_key = createHash("keccak256").update(args[0]).toString();
  
  const raw_form_data = args[0];
  const api_endpoint = args[1];
  const api_key = hashed_api_key;
  

  // create a new cbv
  const new_cbv_code_name = await get_new_cbv_code_name ();
  // extract informatio from form string into an object
  const brokedown_form = breakdown_form(raw_form_data, new_cbv_code_name);
  // create a beautiful .md file to be store in issues
  const cbv_ready_to_be_stored = prettify(brokedown_form)
  // Store the new CBV in Issues folder TODO: check if multiples bc gives back string or array
  await store_new_cbv_in_folder(new_cbv_code_name, cbv_ready_to_be_stored);
  
  //TODO: optional. Ask to store in folder "Issues" or "Issues/<given_blockchain>"
  //TODO: call store endpoind (CBV, key) and save the new CBV in DB
  await store_new_cbv_in_db(brokedown_form, api_endpoint, api_key);

  /*
  * Log the CBV code to grab it in github actions
  */
  console.log(new_cbv_code_name)
  return new_cbv_code_name
}


async function get_new_cbv_code_name (): Promise<string> {

  let last_cbv_added = 0
  const currentPath = `${Deno.cwd()}/issues`
  const list_of_dir = await find_all_dir(currentPath);

  async function find_all_dir(path:string): Promise<string[]> {
    const folders: string[] = [];
    for await (const dirEntry of Deno.readDir(path)) {
      if (dirEntry.isDirectory) {
        folders.push(`${dirEntry}`);
      }
    }
    return folders
  }
  const list_of_files = find_all_files(list_of_dir);

  async function find_all_files(_list_of_dir: string[]): Promise<string[]> {
    const files: string[]= [];
    for await (const folder of _list_of_dir) {
      for await (const dirEntry of Deno.readDir(folder)) {
        const current_file_number = Number(dirEntry.name.replace(/\D/g,''));
        if (current_file_number > last_cbv_added) last_cbv_added = current_file_number;
      }
    }
    return files
  }

  // name the next file, allways replace with current year
  const new_cbv_number = (last_cbv_added + 1).toString().slice(2);
  const current_year = (new Date()).getFullYear() - 2000
  const new_cbv_name = `CBV-${current_year}-${new_cbv_number}`
  return new_cbv_name
}

  async function getNames(currentPath: string) {
    const names: string[] = [];
  
    for await (const dirEntry of Deno.readDir(currentPath)) {
      const entryPath = `${currentPath}/${dirEntry.name}`;
      names.push(entryPath);
  
      if (dirEntry.isDirectory) {
        names.push(await getNames(entryPath));
      }
    }
  
    return names;
  }

/*
* Recieve issues form from github and output an object
*/
function breakdown_form ( issue_form: string, new_cbv_code_name: string ): CBV{
  const now = getCurrentDate();
  const split = issue_form.split('###')
  const form_object = {
    title: split[1].replace("Title", "").trim(),
    short_description: split[2].replace("Short description", "").trim(),
    cbv_id: new_cbv_code_name,
    blockchain: split[3].replace(/Blockchain/, "").trim(),
    version_affected: split[4].replace("Version affected", "").trim(),
    component: split[5].replace(/Component/, "").trim(),
    severity: split[6].replace(/Severity/, "").trim(),
    vulnerability_type: split[7].replace("Vulnerability Type", "").trim(),
    details: split[8].replace(/Details/, "").trim(),
    recommendation: split[9].replace(/Recommendation/, "").trim(),
    references: split[10].replace(/References/, "").trim(),
    labels: split[11].replace("Labels", "").trim(),
    tests: split[12].replace(/Test/, "").trim(),
    aditional_comments: split[13].replace("Aditional comments", "").trim(),
    created_at: now,
    updated_at: ""
  }
  console.log(form_object)
  return form_object
}

function prettify (form_object: CBV): string {

  const formated_cbv_as_md = `# ${form_object.title}
  
${form_object.short_description}
  
### CBV:ID ${form_object.cbv_id}
### Blockchain: ${form_object.blockchain}
### Version affected: ${form_object.version_affected}
### Component: ${form_object.component}
### Severity: ${form_object.severity}
### Vulnerability Type: ${form_object.vulnerability_type}
### Last updated: ${form_object.created_at}

## Details

${form_object.details}

## Recomendations

${form_object.recommendation}

## References

${form_object.references}

### Labels: ${form_object.labels}

## Test

${form_object.tests}

## Aditional comments

${form_object.aditional_comments}
`

  return formated_cbv_as_md.replace(/_No response_/g, "-")
}

interface CBV {
  title: string;
  short_description: string;
  cbv_id: string;
  blockchain: string;
  version_affected: string;
  component: string;
  severity: string;
  vulnerability_type: string;
  details: string;
  recommendation: string;
  references: string;
  labels: string;
  tests: string;
  aditional_comments: string;
  created_at: string;
  updated_at: string;
}

function getCurrentDate() {
  const timeStamp = new Date().toUTCString().split(" ");
  const date = `${timeStamp[1]} ${timeStamp[2]} ${timeStamp[3]}`;
  return date;
}

// TODO: function to store in every folder
async function store_new_cbv_in_folder(_new_cbv_code_name, _cbv_ready_to_be_stored) {
  await Deno.writeTextFile(`./issues/${_new_cbv_code_name}.md`, _cbv_ready_to_be_stored);
}

async function store_new_cbv_in_db(_obj_data: CBV, _api_endpoint: string, _api_key: string) {
  
}