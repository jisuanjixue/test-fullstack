export class Form{
  constructor(props) {
    console.log('FormValid constructor', props)
  }

  valid({data, schemaData}) {
    console.log(data, schemaData);
  }

}