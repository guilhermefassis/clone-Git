    const simpleGit = require('simple-git');
    const yargs = require('yargs');

    function extractName(repoPath) {
        const parts = repoPath.split('/');
        const repoNameWithExtension = parts[parts.length - 1];
        const repoName = repoNameWithExtension.split('.')[0];
        return repoName;
    }
    async function pushToNewRepo(folderPath, repoName, target) {
        const repo = await simpleGit(folderPath);
        const newRepoPath = target + '/' + repoName;
        
        await repo.fetch(['--all'], async (fetchError) => {
            if (fetchError) {
                console.error('Erro ao fazer fetch das branches:', fetchError);
                return;
            } else {
                console.log('Fetch realizado com sucesso...')
            }    
        });        
        await repo.addRemote('newOrigin', newRepoPath, (addRemoteError) => {
            if (addRemoteError) {
                console.error('Erro ao adicionar o remote origin:', addRemoteError);
            } else {
                console.log('Remote newOrigin adicionado com sucesso.');
            }
        });

        await repo.push('newOrigin', 'master', ['--set-upstream'], (pushError) => {
            if (pushError) {
                console.error('Erro ao fazer push:', pushError);
                return;
            } else {
                console.log('Repositorio criado com sucesso em: ' + newRepoPath);
            }
        });
    }

    async function gitClone(repo, folderPath) {
        const git = simpleGit();
        await git.clone(repo, folderPath, (err) => {
            if(err) {
                console.error('Erro ao clonar repositorio ' + err);
            }
            else {
                console.log('Repositorio clonado em ' + folderPath);
            }
        })
    } 

    async function main() {
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
            .option ('p', {
                alias: 'push',
                describe: 'target onde sera enviado os repos',
                demandOption: false,
                type: 'string'
            })
            .argv;

        const repo = argv.repo;
        const repos = argv.repoList;
        const target = argv.push;
        let folderPath = argv.folder;
        

        if(repo) {
            const folderName = extractName(repo);
            folderPath += '\\' + folderName
            await gitClone(repo, folderPath);

            if(target) {
                await pushToNewRepo(folderPath, folderName, target); 
            }
        } else if (repos) {
            for (var i = 0; i < repos.length; i++){
                const folderName = extractName(repos[i]);
                folderPath += '\\' + folderName;
                await gitClone(repos[i], folderPath);
                if(target) {
                    await pushToNewRepo(folderPath, folderName, target);   
                }
            }
        } else {
            console.error('Nao ha nenhum repositorio para ser clonado.');
        }
    }

    module.exports = {
        main
    }