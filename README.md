# architect-docs

These are the architect docs for the leverege platform. Upon running `npm generate docs` in this repo, the docs will dynamically generate and pull appropiate documents provided in the repos.json

### repos.json

Here is an example of one repo from repos.json:

```
[
  {
    "name" : "api-ui",
    "url" : "git@bitbucket.org:leverege/api-ui.git",
    "files" : ["README.md", "Main.jsx"],
    "indexFiles" : 
    "supportingFilesDirs" : ["docs/", "src/"],
    "location" : [ "service" ]
  }
]
```

`name` is the name of the repo you are pulling 
`url` is the git URL the script will attempt to pull
`files` are the files that will be pulled as docs 
`location` is top directory where the pulled docs will be placed
`supportingFilesDirs` where in the pulled repo the desired docs could be (root is always checked



### Config.json
