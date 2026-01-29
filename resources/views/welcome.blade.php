<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel Showcase</title>
    <style>
        #app { opacity: 0; transition: opacity 0.3s; }
        #app.loaded { opacity: 1; }
    </style>
    @vite(['resources/js/app.ts'])
</head>
<body>
    <div id="app">
        <create-post></create-post>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => document.getElementById('app').classList.add('loaded'), 50);
        });
    </script>
</body>
</html>