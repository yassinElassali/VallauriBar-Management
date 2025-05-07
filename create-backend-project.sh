#!/bin/bash

# Creates a Vanilla PHP project
function create_vanilla_php_project() {
    echo "Installing latest PHP version" 
    bash -c "$(curl -fsSL https://php.new/install/linux)"
    echo "DONE"

    echo "Creating template files..."
    mkdir "js" "css"
    touch "js/index.js" "css/style.css"
    cat <<EOF > "index.php"
<html>
    <head>
        <title>PHP Vanilla app</title>
        <link rel="stylesheet" href="css/style.css">
        <script src="js/index.js"></script>
    </head>
    <body>
        <p><?php echo "It Works" ?></p>
    </body>
</html>
EOF
    echo "DONE"
}

# Creates a Laravel PHP project
function create_laravel_project() {
    echo "Installing Laravel CLI, Installer and its dependencies..." 
    bash -c "$(curl -fsSL https://php.new/install/linux)"
    export PATH="$HOME/.config/herd-lite/bin:$PATH" 
    echo 'export PATH="$HOME/.config/herd-lite/bin:$PATH"' >> "$HOME/.profile"
    echo "DONE"

    echo "Creating Laravel project..."
    laravel new tmp \
        --force \
        --database sqlite \
        --phpunit \
        --no-interaction
    cp -rf tmp/. .
    rm -rf tmp
    echo "DONE"

    echo "PHP Laravel project created successfully, saving git commit..."
    git add .
    git commit -m "(backend) :sparkles: Created PHP + Laravel project from template"
    echo "DONE"
}

# Creates a vanilla NodeJS + Typescript project
function create_vanilla_nodejs_project() {
    echo "Creating Vanilla NodeJS + Typescript project"
    echo "Creating template files..."
    cat <<EOF > "package.json"
{
    "name": "vanilla-backend",
    "version": "1.0.0",
    "description": "A Vanilla NodeJS + Typescript template for a backend",
    "scripts": {
        "start": "nodemon src/index.ts"
    },
    "license": "UNLICENSED",
    "private": "true",
    "type": "commonjs"
}
EOF
    mkdir -p "src"
    cat <<EOF > "src/index.ts"
import http, { IncomingMessage, ServerResponse } from "http";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World!\n");
});

server.listen(port, hostname, () : void => {
    console.log(\`Server running at http://\${hostname}:\${port}\`);
});
EOF
    echo "DONE"
    
    echo "Adding development packages..."
    npm install --save-dev "typescript" "ts-node" "@types/node"
    echo "DONE"

    echo "Adding tsconfig.json..."
    npm exec tsc -- --init
    echo "DONE"

    rm -f README.md

    echo "NodeJS Vanilla project created successfully, saving git commit..."
    git add .
    git commit -m "(backend) :sparkles: Created Vanilla NodeJS + Typescript project from template"
    echo "DONE"
}

# Creates a NodeJS + Express + Typescript project
function create_express_project() {
    echo "Creating NodeJS + Express + Typescript project"
    echo "Creating template files..."
    cat <<EOF > "package.json"
{
    "name": "express-backend",
    "version": "1.0.0",
    "description": "A NodeJS + Express + Typescript template for a backend",
    "scripts": {
        "start": "nodemon src/index.ts"
    },
    "license": "UNLICENSED",
    "private": "true",
    "type": "commonjs"
}
EOF
    mkdir -p ./src
    cat <<EOF > src/index.ts
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(\`Example app listening on port \${port}\`);
})
EOF
    echo "DONE"
    
    echo "Adding development packages..."
    npm install --save-dev "typescript" "ts-node" "@types/node"
    echo "DONE"

    echo "Adding tsconfig.json..."
    npm exec tsc -- --init
    echo "DONE"

    echo "Adding express dependency..."
    npm install --save-dev "@types/express"
    npm install "express"
    echo "DONE"

    rm -f README.md

    echo "Express project created successfully, saving git commit..."
    git add .
    git commit -m "(backend) :sparkles: Created Express + Typescript project from template"
    echo "DONE"
}

# Creates a NestJS + Typescript project
function create_nestjs_project() {
    echo "Creating NestJS project..."
    nest new \
        --directory "." \
        --skip-git "true" \
        --package-manager "npm" \
        --language "TypeScript" \
        --strict

    echo "NestJS project created successfully, saving git commit..."
    git add .
    git commit -m "(backend) :sparkles: Created NestJS + Typescript project from template"
    echo "DONE"
}

if find backend -mindepth 1 -maxdepth 1 | read; then
    echo "Backend directory is not empty. This script will destroy its contents."
    echo "Are you absolutely sure? (Y/n)"

    read answer
    if [ "$answer" != "Y" ]; then
        echo "Aborting"
        exit 0
    fi
fi

rm -rf backend
mkdir -p backend || true

project_root="$(pwd)"
framework_flag="$1"

cd backend

case "$framework_flag" in
    "") create_vanilla_nodejs_project;;
    --nodejs) create_vanilla_nodejs_project;;
    --express) create_express_project;;
    --nestjs) create_nestjs_project;;
    --php) create_vanilla_php_project;;
    --laravel) create_laravel_project;;
esac

cd "$project_root"
