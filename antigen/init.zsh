#-- START ZCACHE GENERATED FILE
#-- GENERATED: Sat Apr  8 13:00:52 IDT 2017
#-- ANTIGEN develop
_antigen () {
	local -a _1st_arguments
	_1st_arguments=('apply:Load all bundle completions' 'bundle:Install and load the given plugin' 'bundles:Bulk define bundles' 'cleanup:Clean up the clones of repos which are not used by any bundles currently loaded' 'cache-gen:Generate cache' 'init:Load Antigen configuration from file' 'list:List out the currently loaded bundles' 'purge:Remove a cloned bundle from filesystem' 'reset:Clears cache' 'restore:Restore the bundles state as specified in the snapshot' 'revert:Revert the state of all bundles to how they were before the last antigen update' 'selfupdate:Update antigen itself' 'snapshot:Create a snapshot of all the active clones' 'theme:Switch the prompt theme' 'update:Update all bundles' 'use:Load any (supported) zsh pre-packaged framework') 
	_1st_arguments+=('help:Show this message' 'version:Display Antigen version') 
	__bundle () {
		_arguments '--loc[Path to the location <path-to/location>]' '--url[Path to the repository <github-account/repository>]' '--branch[Git branch name]' '--no-local-clone[Do not create a clone]'
	}
	__list () {
		_arguments '--simple[Show only bundle name]' '--short[Show only bundle name and branch]' '--long[Show bundle records]'
	}
	__cleanup () {
		_arguments '--force[Do not ask for confirmation]'
	}
	_arguments '*:: :->command'
	if (( CURRENT == 1 ))
	then
		_describe -t commands "antigen command" _1st_arguments
		return
	fi
	local -a _command_args
	case "$words[1]" in
		(bundle) __bundle ;;
		(use) compadd "$@" "oh-my-zsh" "prezto" ;;
		(cleanup) __cleanup ;;
		(update|purge) compadd $(type -f \-antigen-get-bundles &> /dev/null || antigen &> /dev/null; -antigen-get-bundles --simple 2> /dev/null) ;;
		(theme) compadd $(type -f \-antigen-get-themes &> /dev/null || antigen &> /dev/null; -antigen-get-themes 2> /dev/null) ;;
		(list) __list ;;
	esac
}
antigen () {
  [[ "$ZSH_EVAL_CONTEXT" =~ "toplevel:*" || "$ZSH_EVAL_CONTEXT" =~ "cmdarg:*" ]] &&     source "/usr/share/zsh/share/antigen.zsh" &&       eval antigen $@
}
fpath+=(/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/catimg /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/compleat /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/dircycle /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/django /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/python /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/sudo /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/systemd /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/taskwarrior /home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip); PATH="$PATH:"
_antigen_compinit () {
  autoload -Uz compinit; compinit -C -d "/home/shoham/.antigen/.zcompdump"; compdef _antigen antigen
  add-zsh-hook -D precmd _antigen_compinit
}
autoload -Uz add-zsh-hook; add-zsh-hook precmd _antigen_compinit
compdef () {}
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git/git.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/catimg/catimg.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/compleat/compleat.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/dircycle/dircycle.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/django/django.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/python/python.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/sudo/sudo.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/systemd/systemd.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/taskwarrior/taskwarrior.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip/pip.plugin.zsh";
source "/home/shoham/.antigen/bundles/robbyrussell/oh-my-zsh/themes/agnoster.zsh-theme";
typeset -aU _ANTIGEN_BUNDLE_RECORD;      _ANTIGEN_BUNDLE_RECORD=('https://github.com/robbyrussell/oh-my-zsh.git plugins/git plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/catimg plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/compleat plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/dircycle plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/django plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/python plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/sudo plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/systemd plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/taskwarrior plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git plugins/pip plugin true' 'https://github.com/robbyrussell/oh-my-zsh.git themes/agnoster.zsh-theme theme true')
_ANTIGEN_CACHE_LOADED=true ANTIGEN_CACHE_VERSION='develop'
#-- END ZCACHE GENERATED FILE

