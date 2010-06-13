var Schema = {
  services : {
    'id': {
      field_type : 'id'
    } ,
    'login': {
      field_type : 'text',
      not_null : true
    },
    'password': { 
      field_type : 'text',
      not_null : true
    }, 
    'type': {
      field_type : 'text',
      not_null : true
    },
    'api_url' : {
      field_type:'text'
    }
  }
};
