const args = Deno.args;

async function main(args: any) {
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
  
  await Deno.writeTextFile(`./issues/${new_cbv_name}.txt`, args[0]);
  await Deno.env.set("NEW_CBV_NAME", new_cbv_name)
  const get = await Deno.env.get("NEW_CBV_NAME")
  console.log(get)
  
  //await Deno.writeTextFile("./endpoint.txt", args[0]); args is working
}

main(args)
/*
async function extract_data(path: string): Promise<CBV> {
  
  try {
    const readed_data = await Deno.readTextFile(path);
    const processed_data = raw_data(readed_data);
    const formated_data = JSON.stringify(processed_data);
    await Deno.writeTextFile("./extracted_data.json", formated_data);
    return processed_data;
  } catch (error) {
    return error.message;
  }
}

function raw_data(readed_data: string): CBV {
  // split on title indicator and deleting every empty item
  const splits = readed_data.split("##").filter((a) => a);
  const formating_title = splits[0].slice(2).split("\r\n").filter((a) => a);
  const formated_title = {
    header: formating_title[0].trim(),
    description: formating_title[1].trim(),
  };
  //TODO: buscar como revisar si estan o no los opcionales y agregarlos al objecto

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

  //const optionals = splits.slice(9)
  
  return response_object;

  */
  /*
  TODO: terminar los if con los casos opcionales
  references: splits[9].replace("References (Optional)", "").trim(),
  labels:
  tests:
  aditional_comments: splits[10].replace("Aditional Comments (Optional)", "").trim()
  */