const args = Deno.args;
/*
* First argument is going to be an object containing the new CBV to be added
* Second argument is the API v1 GraphQL endpoint to store the CBV
* Third argument is going to be a Key to validate the store endpoint
*/

main(args)

async function main(args: any) {

  //TODO: add key validation to store endpoint
  //TODO: call store endpoind (CBV, key) and save the new CBV in DB

  //lock for the last file added
  let last_cbv_added = 0
  for await (const dirEntry of Deno.readDir(`${Deno.cwd()}/issues`)) {
    const current_file_number = Number(dirEntry.name.replace(/\D/g,''));
    if (current_file_number > last_cbv_added) last_cbv_added = current_file_number;
  }
  // name the next file, allways replace with current year
  const new_cbv_number = (last_cbv_added + 1).toString().slice(2);
  const current_year = (new Date()).getFullYear() - 2000
  const new_cbv_name = `CBV-${current_year}-${new_cbv_number}`

  // TODO: Prettify the .md file before storing it in repository
  
  // Store the new CBV in Issues folder
  await Deno.writeTextFile(`./issues/${new_cbv_name}.md`, args[0]);

  //TODO: optional. Ask to store in folder "Issues" or "Issues/<given_blockchain>"


  /*
  * Log the CBV code to grab it in github actions
  */
  console.log(new_cbv_name)
}

interface Title {
  header: string;
  description: string;
}

interface CBV {
  title: Title;
  id: string;
  blockchain: string;
  version_affected: string;
  component: string;
  severity: number;
  vulnerability_type: string;
  details: string;
  recommendation: string;
  references?: string | null;
  labels?: Array<string> | null;
  tests?: string | null;
  aditional_comments?: string | null;
}

// TODO: re write the original function that work locally to work with the object given by github issue event
function raw_data(readed_data: string): CBV {
  // split on title indicator and deleting every empty item
  const splits = readed_data.split("###").filter((a) => a);
  const formating_title = splits[0].slice(2).split("\r\n").filter((a) => a);
  const formated_title = {
    header: formating_title[0].trim(),
    description: formating_title[1].trim(),
  };

  const response_object: CBV = {
    title: formated_title,
    id: splits[1].replace("# ID:", "").trim(),
    blockchain: splits[2].replace("# Blockchain:", "").trim(),
    version_affected: splits[3].replace("# Version affected:", "").trim(),
    component: splits[4].replace("# Component:", "").trim(),
    severity: Number(splits[5].replace("# Severity:", "").trim()),
    vulnerability_type: splits[6].replace("# Vulnerability Type:", "").trim(),
    details: splits[7].replace("Details", "").trim(),
    recommendation: splits[8].replace("Recommendation", "").trim(),
  };
  if (splits.length === 9) return response_object;

  /* Add
  *References
  *Labels
  * Test
  * Aditional comments
  */
  
  return response_object;
}
