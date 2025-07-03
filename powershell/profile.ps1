
using namespace System.Management.Automation
using namespace System.Management.Automation.Language

$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'

oh-my-posh.exe init pwsh --config C:\Users\kchon\catppuccin.omp.json | Invoke-Expression

Set-PSReadLineOption -PredictionSource None
Set-PSReadLineOption -HistorySearchCursorMovesToEnd

Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadlineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadlineKeyHandler -Key DownArrow -Function HistorySearchForward

Import-Module posh-git

# # $GitPromptSettings.EnableFileStatus = $false

# # $GitPromptSettings.DefaultPromptPrefix.Text = '$(Get-Date -f "MM-dd HH:mm:ss") '
# $GitPromptSettings.DefaultPromptAbbreviateHomeDirectory = $true
# $GitPromptSettings.DefaultPromptPrefix.ForegroundColor = [ConsoleColor]::Magenta
# $GitPromptSettings.DefaultPromptBeforeSuffix.Text = '`n'

# Get-ChildItem "$PROFILE\..\Completions\" | ForEach-Object {
#     . $_.FullName
# }

Invoke-Expression (& { (zoxide init powershell --cmd cd | Out-String) })

# powershell completion for pnpm -*- shell-script -*-

# Register-ArgumentCompleter -CommandName 'pnpm' -ScriptBlock {
#     param(
#             $WordToComplete,
#             $CommandAst,
#             $CursorPosition
#         )

#     function __pnpm_debug {
#         if ($env:BASH_COMP_DEBUG_FILE) {
#             "$args" | Out-File -Append -FilePath "$env:BASH_COMP_DEBUG_FILE"
#         }
#     }

#     filter __pnpm_escapeStringWithSpecialChars {
#         $_ -replace '\s|#|@|\$|;|,|''|\{|\}|\(|\)|"|`|\||<|>|&','`$&'
#     }

#     # Get the current command line and convert into a string
#     $Command = $CommandAst.CommandElements
#     $Command = "$Command"

#     __pnpm_debug ""
#     __pnpm_debug "========= starting completion logic =========="
#     __pnpm_debug "WordToComplete: $WordToComplete Command: $Command CursorPosition: $CursorPosition"

#     # The user could have moved the cursor backwards on the command-line.
#     # We need to trigger completion from the $CursorPosition location, so we need
#     # to truncate the command-line ($Command) up to the $CursorPosition location.
#     # Make sure the $Command is longer then the $CursorPosition before we truncate.
#     # This happens because the $Command does not include the last space.
#     if ($Command.Length -gt $CursorPosition) {
#         $Command=$Command.Substring(0,$CursorPosition)
#     }
#     __pnpm_debug "Truncated command: $Command"

#     # Prepare the command to request completions for the program.
#     # Split the command at the first space to separate the program and arguments.
#     $Program,$Arguments = $Command.Split(" ",2)
#     $RequestComp="$Program completion"
#     __pnpm_debug "RequestComp: $RequestComp"

#     # we cannot use $WordToComplete because it
#     # has the wrong values if the cursor was moved
#     # so use the last argument
#     if ($WordToComplete -ne "" ) {
#         $WordToComplete = $Arguments.Split(" ")[-1]
#     }
#     __pnpm_debug "New WordToComplete: $WordToComplete"


#     # Check for flag with equal sign
#     $IsEqualFlag = ($WordToComplete -Like "--*=*" )
#     if ( $IsEqualFlag ) {
#         __pnpm_debug "Completing equal sign flag"
#         # Remove the flag part
#         $Flag,$WordToComplete = $WordToComplete.Split("=",2)
#     }

#     if ( $WordToComplete -eq "" -And ( -Not $IsEqualFlag )) {
#         # If the last parameter is complete (there is a space following it)
#         # We add an extra empty parameter so we can indicate this to the go method.
#         __pnpm_debug "Adding extra empty parameter"
#         # We need to use `"`" to pass an empty argument a "" or '' does not work!!!
#         $Command="$Command" + ' `"`"'
#     }

#     __pnpm_debug "Calling $RequestComp"

#     $WordCount = $Command.Split(" ").Count - 1
#     __pnpm_debug "Word count: $WordCount"

#     $PreviousWord = $Command.Split(" ")[-2]
#     __pnpm_debug "Previous word: $PreviousWord"

#     if (-not $WordToComplete.StartsWith("-") -and ($PreviousWord -eq "run" -or $PreviousWord -eq "run-script")) {
#         # manually handle the completion of scripts
#         try {
#             $scripts = (Get-Content .\package.json | ConvertFrom-Json).scripts
#             $names = $scripts | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
#             $out = $names | ForEach-Object { "$_`t$($scripts.$_)" }
#         } catch {
#             $out = @()
#         }
#     } else {
#         $oldenv = ($env:SHELL, $env:COMP_CWORD, $env:COMP_LINE, $env:COMP_POINT)
#         $env:SHELL = "/usr/bin/fish"
#         $env:COMP_CWORD = $WordCount
#         $env:COMP_POINT = $CursorPosition
#         $env:COMP_LINE = $Command

#         try {
#             #call the command store the output in $out and redirect stderr and stdout to null
#             # $Out is an array contains each line per element
#             Invoke-Expression -OutVariable out "$RequestComp" 2>&1 | Out-Null
#         } finally {
#             ($env:SHELL, $env:COMP_CWORD, $env:COMP_LINE, $env:COMP_POINT) = $oldenv
#         }
#     }

#     __pnpm_debug "The completions are: $Out"

#     if ($WordCount -ne 1 -and $Out.Contains("--version")) {
#         # fix for pnpm recursively printing root completions
#         __pnpm_debug "Found recursion, skipping"
#         return
#     }

#     $Longest = 0
#     $Values = $Out | ForEach-Object {
#         #Split the output in name and description
#         $Name, $Description = $_.Split("`t",2)
#         __pnpm_debug "Name: $Name Description: $Description"

#         # Look for the longest completion so that we can format things nicely
#         if ($Longest -lt $Name.Length) {
#             $Longest = $Name.Length
#         }

#         # Set the description to a one space string if there is none set.
#         # This is needed because the CompletionResult does not accept an empty string as argument
#         if (-Not $Description) {
#             $Description = " "
#         }
#         @{Name="$Name";Description="$Description"}
#     }


#     $Space = " "
#     $Values = $Values | Where-Object {
#         # filter the result
#         if (-not $WordToComplete.StartsWith("-") -and $_.Name.StartsWith("-")) {
#             # skip flag completions unless a dash is present
#             return
#         } else {
#             $_.Name -like "$WordToComplete*"
#         }

#         # Join the flag back if we have an equal sign flag
#         if ( $IsEqualFlag ) {
#             __pnpm_debug "Join the equal sign flag back to the completion value"
#             $_.Name = $Flag + "=" + $_.Name
#         }
#     }

#     # Get the current mode
#     $Mode = (Get-PSReadLineKeyHandler | Where-Object {$_.Key -eq "Tab" }).Function
#     __pnpm_debug "Mode: $Mode"

#     $Values | ForEach-Object {

#         # store temporary because switch will overwrite $_
#         $comp = $_

#         # PowerShell supports three different completion modes
#         # - TabCompleteNext (default windows style - on each key press the next option is displayed)
#         # - Complete (works like bash)
#         # - MenuComplete (works like zsh)
#         # You set the mode with Set-PSReadLineKeyHandler -Key Tab -Function <mode>

#         # CompletionResult Arguments:
#         # 1) CompletionText text to be used as the auto completion result
#         # 2) ListItemText   text to be displayed in the suggestion list
#         # 3) ResultType     type of completion result
#         # 4) ToolTip        text for the tooltip with details about the object

#         switch ($Mode) {

#             # bash like
#             "Complete" {

#                 if ($Values.Length -eq 1) {
#                     __pnpm_debug "Only one completion left"

#                     # insert space after value
#                     [System.Management.Automation.CompletionResult]::new($($comp.Name | __pnpm_escapeStringWithSpecialChars) + $Space, "$($comp.Name)", 'ParameterValue', "$($comp.Description)")

#                 } else {
#                     # Add the proper number of spaces to align the descriptions
#                     while($comp.Name.Length -lt $Longest) {
#                         $comp.Name = $comp.Name + " "
#                     }

#                     # Check for empty description and only add parentheses if needed
#                     if ($($comp.Description) -eq " " ) {
#                         $Description = ""
#                     } else {
#                         $Description = "  ($($comp.Description))"
#                     }

#                     [System.Management.Automation.CompletionResult]::new("$($comp.Name)$Description", "$($comp.Name)$Description", 'ParameterValue', "$($comp.Description)")
#                 }
#              }

#             # zsh like
#             "MenuComplete" {
#                 # insert space after value
#                 # MenuComplete will automatically show the ToolTip of
#                 # the highlighted value at the bottom of the suggestions.
#                 [System.Management.Automation.CompletionResult]::new($($comp.Name | __pnpm_escapeStringWithSpecialChars) + $Space, "$($comp.Name)", 'ParameterValue', "$($comp.Description)")
#             }

#             # TabCompleteNext and in case we get something unknown
#             Default {
#                 # Like MenuComplete but we don't want to add a space here because
#                 # the user need to press space anyway to get the completion.
#                 # Description will not be shown because that's not possible with TabCompleteNext
#                 [System.Management.Automation.CompletionResult]::new($($comp.Name | __pnpm_escapeStringWithSpecialChars), "$($comp.Name)", 'ParameterValue', "$($comp.Description)")
#             }
#         }

#     }
# }



# just completion
Register-ArgumentCompleter -Native -CommandName 'just' -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)

    $commandElements = $commandAst.CommandElements
    $command = @(
        'just'
        for ($i = 1; $i -lt $commandElements.Count; $i++) {
            $element = $commandElements[$i]
            if ($element -isnot [StringConstantExpressionAst] -or
                $element.StringConstantType -ne [StringConstantType]::BareWord -or
                $element.Value.StartsWith('-') -or
                $element.Value -eq $wordToComplete) {
                break
        }
        $element.Value
    }) -join ';'

    $completions = @(switch ($command) {
        'just' {
            [CompletionResult]::new('--alias-style', '--alias-style', [CompletionResultType]::ParameterName, 'Set list command alias display style')
            [CompletionResult]::new('--chooser', '--chooser', [CompletionResultType]::ParameterName, 'Override binary invoked by `--choose`')
            [CompletionResult]::new('--color', '--color', [CompletionResultType]::ParameterName, 'Print colorful output')
            [CompletionResult]::new('--command-color', '--command-color', [CompletionResultType]::ParameterName, 'Echo recipe lines in <COMMAND-COLOR>')
            [CompletionResult]::new('--dotenv-filename', '--dotenv-filename', [CompletionResultType]::ParameterName, 'Search for environment file named <DOTENV-FILENAME> instead of `.env`')
            [CompletionResult]::new('-E', '-E ', [CompletionResultType]::ParameterName, 'Load <DOTENV-PATH> as environment file instead of searching for one')
            [CompletionResult]::new('--dotenv-path', '--dotenv-path', [CompletionResultType]::ParameterName, 'Load <DOTENV-PATH> as environment file instead of searching for one')
            [CompletionResult]::new('--dump-format', '--dump-format', [CompletionResultType]::ParameterName, 'Dump justfile as <FORMAT>')
            [CompletionResult]::new('-f', '-f', [CompletionResultType]::ParameterName, 'Use <JUSTFILE> as justfile')
            [CompletionResult]::new('--justfile', '--justfile', [CompletionResultType]::ParameterName, 'Use <JUSTFILE> as justfile')
            [CompletionResult]::new('--list-heading', '--list-heading', [CompletionResultType]::ParameterName, 'Print <TEXT> before list')
            [CompletionResult]::new('--list-prefix', '--list-prefix', [CompletionResultType]::ParameterName, 'Print <TEXT> before each list item')
            [CompletionResult]::new('--set', '--set', [CompletionResultType]::ParameterName, 'Override <VARIABLE> with <VALUE>')
            [CompletionResult]::new('--shell', '--shell', [CompletionResultType]::ParameterName, 'Invoke <SHELL> to run recipes')
            [CompletionResult]::new('--shell-arg', '--shell-arg', [CompletionResultType]::ParameterName, 'Invoke shell with <SHELL-ARG> as an argument')
            [CompletionResult]::new('--timestamp-format', '--timestamp-format', [CompletionResultType]::ParameterName, 'Timestamp format string')
            [CompletionResult]::new('-d', '-d', [CompletionResultType]::ParameterName, 'Use <WORKING-DIRECTORY> as working directory. --justfile must also be set')
            [CompletionResult]::new('--working-directory', '--working-directory', [CompletionResultType]::ParameterName, 'Use <WORKING-DIRECTORY> as working directory. --justfile must also be set')
            [CompletionResult]::new('-c', '-c', [CompletionResultType]::ParameterName, 'Run an arbitrary command with the working directory, `.env`, overrides, and exports set')
            [CompletionResult]::new('--command', '--command', [CompletionResultType]::ParameterName, 'Run an arbitrary command with the working directory, `.env`, overrides, and exports set')
            [CompletionResult]::new('--completions', '--completions', [CompletionResultType]::ParameterName, 'Print shell completion script for <SHELL>')
            [CompletionResult]::new('-l', '-l', [CompletionResultType]::ParameterName, 'List available recipes')
            [CompletionResult]::new('--list', '--list', [CompletionResultType]::ParameterName, 'List available recipes')
            [CompletionResult]::new('--request', '--request', [CompletionResultType]::ParameterName, 'Execute <REQUEST>. For internal testing purposes only. May be changed or removed at any time.')
            [CompletionResult]::new('-s', '-s', [CompletionResultType]::ParameterName, 'Show recipe at <PATH>')
            [CompletionResult]::new('--show', '--show', [CompletionResultType]::ParameterName, 'Show recipe at <PATH>')
            [CompletionResult]::new('--check', '--check', [CompletionResultType]::ParameterName, 'Run `--fmt` in ''check'' mode. Exits with 0 if justfile is formatted correctly. Exits with 1 and prints a diff if formatting is required.')
            [CompletionResult]::new('--clear-shell-args', '--clear-shell-args', [CompletionResultType]::ParameterName, 'Clear shell arguments')
            [CompletionResult]::new('-n', '-n', [CompletionResultType]::ParameterName, 'Print what just would do without doing it')
            [CompletionResult]::new('--dry-run', '--dry-run', [CompletionResultType]::ParameterName, 'Print what just would do without doing it')
            [CompletionResult]::new('--explain', '--explain', [CompletionResultType]::ParameterName, 'Print recipe doc comment before running it')
            [CompletionResult]::new('-g', '-g', [CompletionResultType]::ParameterName, 'Use global justfile')
            [CompletionResult]::new('--global-justfile', '--global-justfile', [CompletionResultType]::ParameterName, 'Use global justfile')
            [CompletionResult]::new('--highlight', '--highlight', [CompletionResultType]::ParameterName, 'Highlight echoed recipe lines in bold')
            [CompletionResult]::new('--list-submodules', '--list-submodules', [CompletionResultType]::ParameterName, 'List recipes in submodules')
            [CompletionResult]::new('--no-aliases', '--no-aliases', [CompletionResultType]::ParameterName, 'Don''t show aliases in list')
            [CompletionResult]::new('--no-deps', '--no-deps', [CompletionResultType]::ParameterName, 'Don''t run recipe dependencies')
            [CompletionResult]::new('--no-dotenv', '--no-dotenv', [CompletionResultType]::ParameterName, 'Don''t load `.env` file')
            [CompletionResult]::new('--no-highlight', '--no-highlight', [CompletionResultType]::ParameterName, 'Don''t highlight echoed recipe lines in bold')
            [CompletionResult]::new('--one', '--one', [CompletionResultType]::ParameterName, 'Forbid multiple recipes from being invoked on the command line')
            [CompletionResult]::new('-q', '-q', [CompletionResultType]::ParameterName, 'Suppress all output')
            [CompletionResult]::new('--quiet', '--quiet', [CompletionResultType]::ParameterName, 'Suppress all output')
            [CompletionResult]::new('--allow-missing', '--allow-missing', [CompletionResultType]::ParameterName, 'Ignore missing recipe and module errors')
            [CompletionResult]::new('--shell-command', '--shell-command', [CompletionResultType]::ParameterName, 'Invoke <COMMAND> with the shell used to run recipe lines and backticks')
            [CompletionResult]::new('--timestamp', '--timestamp', [CompletionResultType]::ParameterName, 'Print recipe command timestamps')
            [CompletionResult]::new('-u', '-u', [CompletionResultType]::ParameterName, 'Return list and summary entries in source order')
            [CompletionResult]::new('--unsorted', '--unsorted', [CompletionResultType]::ParameterName, 'Return list and summary entries in source order')
            [CompletionResult]::new('--unstable', '--unstable', [CompletionResultType]::ParameterName, 'Enable unstable features')
            [CompletionResult]::new('-v', '-v', [CompletionResultType]::ParameterName, 'Use verbose output')
            [CompletionResult]::new('--verbose', '--verbose', [CompletionResultType]::ParameterName, 'Use verbose output')
            [CompletionResult]::new('--yes', '--yes', [CompletionResultType]::ParameterName, 'Automatically confirm all recipes.')
            [CompletionResult]::new('--changelog', '--changelog', [CompletionResultType]::ParameterName, 'Print changelog')
            [CompletionResult]::new('--choose', '--choose', [CompletionResultType]::ParameterName, 'Select one or more recipes to run using a binary chooser. If `--chooser` is not passed the chooser defaults to the value of $JUST_CHOOSER, falling back to `fzf`')
            [CompletionResult]::new('--dump', '--dump', [CompletionResultType]::ParameterName, 'Print justfile')
            [CompletionResult]::new('-e', '-e', [CompletionResultType]::ParameterName, 'Edit justfile with editor given by $VISUAL or $EDITOR, falling back to `vim`')
            [CompletionResult]::new('--edit', '--edit', [CompletionResultType]::ParameterName, 'Edit justfile with editor given by $VISUAL or $EDITOR, falling back to `vim`')
            [CompletionResult]::new('--evaluate', '--evaluate', [CompletionResultType]::ParameterName, 'Evaluate and print all variables. If a variable name is given as an argument, only print that variable''s value.')
            [CompletionResult]::new('--fmt', '--fmt', [CompletionResultType]::ParameterName, 'Format and overwrite justfile')
            [CompletionResult]::new('--groups', '--groups', [CompletionResultType]::ParameterName, 'List recipe groups')
            [CompletionResult]::new('--init', '--init', [CompletionResultType]::ParameterName, 'Initialize new justfile in project root')
            [CompletionResult]::new('--man', '--man', [CompletionResultType]::ParameterName, 'Print man page')
            [CompletionResult]::new('--summary', '--summary', [CompletionResultType]::ParameterName, 'List names of available recipes')
            [CompletionResult]::new('--variables', '--variables', [CompletionResultType]::ParameterName, 'List names of variables')
            [CompletionResult]::new('-h', '-h', [CompletionResultType]::ParameterName, 'Print help')
            [CompletionResult]::new('--help', '--help', [CompletionResultType]::ParameterName, 'Print help')
            [CompletionResult]::new('-V', '-V ', [CompletionResultType]::ParameterName, 'Print version')
            [CompletionResult]::new('--version', '--version', [CompletionResultType]::ParameterName, 'Print version')
            break
        }
    })

    function Get-JustFileRecipes([string[]]$CommandElements) {
        $justFileIndex = $commandElements.IndexOf("--justfile");

        if ($justFileIndex -ne -1 -and $justFileIndex + 1 -le $commandElements.Length) {
            $justFileLocation = $commandElements[$justFileIndex + 1]
        }

        $justArgs = @("--summary")

        if (Test-Path $justFileLocation) {
            $justArgs += @("--justfile", $justFileLocation)
        }

        $recipes = $(just @justArgs) -split ' '
        return $recipes | ForEach-Object { [CompletionResult]::new($_) }
    }

    $elementValues = $commandElements | Select-Object -ExpandProperty Value
    $recipes = Get-JustFileRecipes -CommandElements $elementValues
    $completions += $recipes
    $completions.Where{ $_.CompletionText -like "$wordToComplete*" } |
        Sort-Object -Property ListItemText
}
