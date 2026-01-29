# Laravel Showcase - Command Cheatsheet

## Getting Started

### Install Dependencies
```bash
composer install
npm install
```

### Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

## Development

### Start Laravel Backend
```bash
php artisan serve
# Runs on http://localhost:8000
```

### Start Frontend Dev Server
```bash
npm run dev
# Runs on http://localhost:5173
```

### Both Together (in separate terminals)
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

## Database

### Run Migrations
```bash
php artisan migrate
```

### Rollback Last Migration
```bash
php artisan migrate:rollback
```

### Rollback All Migrations
```bash
php artisan migrate:reset
```

### Refresh Database (rollback + migrate)
```bash
php artisan migrate:refresh
```

### Seed Database
```bash
php artisan db:seed
```

### Fresh Database (reset + migrate + seed)
```bash
php artisan migrate:fresh --seed
```

## Generate New Resources

### Create Migration
```bash
php artisan make:migration create_table_name_table
```

### Create Model
```bash
php artisan make:model ModelName
```

### Create Model with Migration and Factory
```bash
php artisan make:model ModelName -m -f
```

### Create Controller
```bash
php artisan make:controller ControllerName
```

### Create Resource Controller (with all methods)
```bash
php artisan make:controller ControllerName --resource
```

### Create Factory
```bash
php artisan make:factory FactoryName
```

### Create Seeder
```bash
php artisan make:seeder SeederName
```

## Frontend

### Build for Production
```bash
npm run build
```

### Format Code
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

## Testing

### Run PHPUnit Tests
```bash
php artisan test
```

### Run Specific Test
```bash
php artisan test tests/Feature/ExampleTest.php
```

## Artisan Tinker

### Interactive Shell
```bash
php artisan tinker
```

Then in the shell:
```php
# Create a post
Post::create(['title' => 'Test', 'content' => 'Content'])

# Get all posts
Post::all()

# Find by ID
Post::find(1)

# Delete
Post::destroy(1)
```

## Cache & Views

### Clear All Caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Clear Route Cache
```bash
php artisan route:cache
```

## Git Workflow

### Conventional Commits
```bash
# Feature
git commit -m "feat: add new feature"

# Bug fix
git commit -m "fix: resolve issue"

# Refactor
git commit -m "refactor: restructure code"

# Chore
git commit -m "chore: update dependencies"
```
