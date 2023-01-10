const data_given_by_gh: string[] = Deno.args;
/*
* First argument is going to be an object containing the new CBV to be added
* Second argument is the API v1 GraphQL endpoint to store the CBV
* Third argument is going to be a Key to validate the store endpoint
*/

main(data_given_by_gh)

async function main(args: string[]) {
  const raw_form_data = args[0];
  const api_endpoint = args[1];
  const api_key = args[2];
  //TODO: add key validation to store endpoint
  //TODO: call store endpoind (CBV, key) and save the new CBV in DB

  // create a new cbv
  const new_cbv_code_name = await get_new_cbv_code_name ();
  // extract informatio from form string into an object
  const brokedown_form = breakdown_form(raw_form_data, new_cbv_code_name);
  // create a beautiful .md file to be store in issues
  const cbv_ready_to_be_stored = prettify(brokedown_form)
  // Store the new CBV in Issues folder TODO: check if multiples bc gives back string or array
  await Deno.writeTextFile(`./issues/${new_cbv_code_name}.md`, cbv_ready_to_be_stored);

  //TODO: optional. Ask to store in folder "Issues" or "Issues/<given_blockchain>"

  /*
  * Log the CBV code to grab it in github actions
  */
  console.log(new_cbv_code_name)
}


async function get_new_cbv_code_name (): Promise<string> {
  let last_cbv_added = 0
  for await (const dirEntry of Deno.readDir(`${Deno.cwd()}/issues`)) {
    const current_file_number = Number(dirEntry.name.replace(/\D/g,''));
    if (current_file_number > last_cbv_added) last_cbv_added = current_file_number;
  }
  // name the next file, allways replace with current year
  const new_cbv_number = (last_cbv_added + 1).toString().slice(2);
  const current_year = (new Date()).getFullYear() - 2000
  const new_cbv_name = `CBV-${current_year}-${new_cbv_number}`
  return new_cbv_name
}

/*
* Recieve issues form from github and output an object
*/
function breakdown_form ( issue_form: string, new_cbv_code_name: string ): CBV{
  
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
}
