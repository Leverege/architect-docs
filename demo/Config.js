function create( env = process.env ) {
  return {
    theme : {
      appearanceProjectId : env.APPEARANCE_PROJECT_ID || process.env.APPEARANCE_PROJECT_ID || '3A48uiQ626esPO2PcnwmaN', // CG: '4EVFMnwW8etUUycNKl6bvJ',
      useActiveTheme : true
    },
    api : {
      host : process.env.IMAGINE_HOST || 'http://localhost:8181',
      systemId : env.SYSTEM_ID || process.env.SYSTEM_ID,
      projectId : env.PROJECT_ID || process.env.PROJECT_ID,
      storeToken : true
    }
  }
}

export default {
  create
}
