fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'MecryTv'
description 'Trucker Job with custom UI'
version '1.0.0'

client_scripts {
    'config.lua',
    'clients/**/*.lua',
    'clients/utils.lua',
}

server_scripts {
    'config.lua',
    'servers/**/*.lua',
}

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/js/jquery.js',
    'ui/js/script.js',
    'ui/style.css',
    'ui/img/*',
    'ui/components/**/*',
    'ui/js/utils.js',
    'ui/config.json',
}