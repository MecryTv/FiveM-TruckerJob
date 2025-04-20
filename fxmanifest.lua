fx_version 'cerulean'
game 'gta5'

author 'MecryTv'
description 'Trucker Job with custom UI'
version '1.0.0'

client_scripts {
    'config.lua',
    'clients/**/*.lua',
}

server_scripts {
    'config.lua',
    'servers/**/*.lua',
}

ui_page 'ui/dist/ui/browser/index.html'

files {
    'ui/dist/ui/browser/index.html',
    'ui/dist/ui/browser/**/*',
}