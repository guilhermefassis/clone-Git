const simpleGit = require('simple-git');
const yargs = require('yargs');


function extractName(repoPath) {
    const parts = repoPath.split('/');
    const repoNameWithExtension = parts[parts.length - 1];
    const repoName = repoNameWithExtension.split('.')[0];
    return repoName;
}

function gitClone(repo, folderPath) {
    const git = simpleGit();
    git.clone(repo, folderPath, (err) => {
        if(err) {
            console.error('Erro ao clonar repositorio ' + err);
        }
        else {
            console.log('Repositorio clonado em ' + folderPath);
        }
    })
} 

function main() {
    const argv = yargs
        .option('r', {
            alias: 'repo',
            describe: 'Url de um unico repositorio',
            demandOption: false,
            type: 'string'
        })
        .option('l', {
            alias: 'repoList',
            describe: 'Uma lista de repositorios que serao clonados',
            demandOption: false,
            type: "array"
        })
        .option ('f', {
            alias: 'folder',
            describe: 'Path da pasta de destino do repositorio',
            demandOption: true,
            type: 'string'
        })
        .argv;

    const repo = argv.repo;
    const repos = argv.repoList;
    let folderPath = argv.folder;
    
    if(repo) {
        const folderName = extractName(repo);
        folderPath += '\\' + folderName
        gitClone(repo, folderPath);
        
    } else if (repos) {
        for (var i = 0; i < repos.length; i++){
            const folderName = extractName(repos[i]);
            const newFolderPath = folderPath + '\\' + folderName;
            gitClone(repos[i], newFolderPath);
        }
    } else {
        console.error('Nao ha nenhum repositorio para ser clonado.');
    }
}

module.exports = {
    main
}