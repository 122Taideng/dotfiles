" Plugin Manager {{{

        filetype off                  " required

        call plug#begin('~/.vim/plugged')
        " The following are examples of different formats supported.
        " Keep Plugin commands between vundle#begin/end.
        Plug 'morhetz/gruvbox' 
        Plug 'vim-airline/vim-airline'
        Plug 'vim-airline/vim-airline-themes'
        Plug 'scrooloose/nerdtree'
        Plug 'tpope/vim-fugitive'
        Plug 'shougo/neocomplete.vim'
        Plug 'neomake/neomake'
        Plug 'ervandew/supertab'
        Plug 'fsharp/vim-fsharp', {
                    \ 'for': 'fsharp',
                    \ 'do': 'make fsautocomplete',
                    \}

        " All of your Plugins must be added before the following line
        call plug#end()            " required
        filetype plugin indent on    " required
        " To ignore plugin indent changes, instead use:
        "filetype plugin on
        "
        " Brief help
        " :PluginList       - lists configured plugins
        " :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
        " :PluginSearch foo - searches for foo; append `!` to refresh local cache
        " :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
        "
        " see :h vundle for more details or wiki for FAQ
        let g:NERDTreeIgnore=['\.pyc$', '\~$'] "ignore files in NERDTree
        let g:airline_powerline_fonts = 1
        set laststatus=2 " Shows Airline
        set ttimeoutlen=10        
" }}}

"  Theme {{{
        set term=xterm-256color
        if has("termguicolors")
            set termguicolors
        endif
        let $NVIM_TUI_ENABLE_TRUE_COLOR=1
        set t_ut=
        colorscheme gruvbox
        set background=dark

        let g:airline_theme='gruvbox'
        let g:airline_powerline_fonts=1
        let g:quantum_italics = 1

" }}}

"  Behavior {{{
        syntax enable
        set tabstop=4		" number of spaces a tab counts for when reading a <TAB> character
        set softtabstop=4 	" number of spaces a tab counts for when inserting/removing a <TAB> character
        set expandtab		" tabs are spaces
        set smarttab        " tabs are derived from the context
        set textwidth=79
        set shiftwidth=4    " tab widht with <SHIFT>+>/<
        set fileformat=unix
        set autoindent
        set smartindent     " Smart indent
        set wrap            " Wrap lines
        set relativenumber	" show line numbers
        set showcmd		    " show last command in bottom bar
        set cursorline		" highlight current line
        filetype indent on	" loads indenting based on filetype. these live in ~/.vim/indent
        set wildmenu		" graphical autocomplete for commands
        set wildignore=*.o,*~,*.pyc " Ignore compiled files
        set ruler           " show current position
        set backspace=indent,eol,start  " backspace acts as it should
        " Ignore case when searching
        set ignorecase
        
        " " When searching try to be smart about cases 
        set smartcase       " If I search with pattern with an Upper case letter, the matching will be case sesnsitive, otherwise it won't (because of ignorecase).

        set lazyredraw		
        set showmatch		" highlight matching {[()]}
        set incsearch		" search as characters are entered
        set hlsearch		" highlight matches
        nnoremap <leader><space> :nohlsearch<CR> " turn off search highlight
        set foldenable          " enable folding
        set foldlevelstart=10   " open most folds by default
        set foldnestmax=10      " 10 nested fold max
        nnoremap <space> za	" space opens/closes folds
        set foldmethod=indent   " fold based on indent level

        set backup
        set backupdir=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
        set backupskip=/tmp/*,/private/tmp/*
        set directory=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
        set writebackup

        set autoread    " read automatically when a file is changed from the outside
        set history=1000
        set encoding=utf-8
        " Return to last edit position when opening files
        
" }}}

"  Functions {{{
        " toggle between number and relativenumber
        function! ToggleNumber()
            if(&relativenumber == 1)
                set norelativenumber
                set number
            else
                set relativenumber
            endif
        endfunc
        autocmd BufReadPost * if line("'\"") > 0 && line("'\"") <= line("$") | exe "normal! g`\"" |  endif
        autocmd BufRead,BufNewFile *.py,*.pyw,*.c,*.h match BadWhitespace /\s\+$/
" }}}

" Python {{{
   " python with virtualenv support
	py << EOF
import os
import sys
if 'VIRTUAL_ENV' in os.environ:
    project_base_dir = os.environ['VIRTUAL_ENV']
    activate_this = os.path.join(project_base_dir, 'bin/activate_this.py')
    execfile(activate_this, dict(__file__=activate_this))
EOF


    let python_highlight_all=1
    syntax on
" }}}

"  Keybindings {{{ 
let mapleader=","       " leader is comma
" Treat long lines as break lines (useful when moving around in them)
map j gj
map k gk
" Disable highlight when <leader><cr> is pressed
map <silent> <leader><cr> :noh<cr>
map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>
map <C-n> :NERDTreeToggle<CR>

" }}}


set modelines=1
" vim:foldmethod=marker:foldlevel=0

