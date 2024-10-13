## Checklist

- Commands
  - [ ] [Explain](#explain)
  - [ ] [Edit](#edit)
  - [ ] [Test](#test)
  - [ ] [Document](#document)
  - [ ] [Smell](#smell)
  - [ ] [Code Actions](#code-actions)
  - [ ] [Custom Commands](#custom-commands)
- Chat
  - [ ] [Chat UX](#chat-ux)
  - [ ] [Chats lefthand panel](#chats-lefthand-panel)
  - [ ] [LLM Selection](#llm-selection)
- [Search](#search)
- Autocomplete
  - [ ] [Manual trigger key binding](#manual-trigger-key-binding)
  - [ ] [Language ignore list](#language-ignore-list)
  - [ ] [LLM selection](#llm-selection)
  - [ ] [Multi-line completions](#multi-line-completions)
  - [ ] [Telemetry and analytics](#telemetry-and-analytics)

## Commands

### Explain

- [ ] Verify that the option to run the `Explain Code` command is available in the following locations:
  - [ ] Sidebar `Explain Code`
  - [ ] Context (right-click) menu `Cody > Explain Code`
  - [ ] Command palette (MetaKey+Shift+p) `Cody Command: Explain Code`
  - [ ] Cody Command Menu (option+c, `Explain Code`)
- [ ] Highlight a section of code in a file.
- [ ] Run the `Explain Code` command.
- [ ] Verify that Cody provides an explanation of the selected code in a new chat window.
- [ ] Move your cursor inside a function in the file without highlighting code, before running the `Explain Code` command again.
- [ ] Verify that Cody provides an explanation of the function that contains your cursor in a new chat window.
- [ ] Verify that the chat executed by running the command is added to the sidebar under `Chats > Today`.

### Edit

#### Editing code

- [ ] Verify that the option to run the `Edit Code` command is available from the sidebar, right-click menu, the command palette (option+c, /edit), or Option+K keyboard shortcut.
- [ ] Highlight a section of code.
- [ ] Run the `Edit Code` command with instructions for how Cody should edit the selected code.
- [ ] Verify that Cody automatically applies edits to the selected code, per the user’s instructions.
- [ ] Verify that there is a notification that "Cody is working..." while edits are being applied.
- [ ] Verify that you can see a list of code lenses with a Cody icon above the first block of the generated code: `Show diff`, `Accept All`, `Retry`, `Undo`, `Accept`, and `Reject`
- [ ] Verify that you see `Accept` and `Reject` code lens for each block of code that Cody has modified.
- [ ] Verify that you can see a diff view of the edit in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `AcceptAll`.
- [ ] Verify that individual blocks ghost text disappears when clicking `Accept`
- [ ] Verify that invidual blocks are reverted when clicking `Reject`

#### Editing code (Additional Configuration)

- [ ] Highlight a section of code.
- [ ] Trigger the Edit shortcut with Option+K
- [ ] Try to add a file to the Edit instruction, by using "@" and searching for a file
- [ ] Try to add a symbol to the Edit instruction, by using "@#" and searching for a symbol
- [ ] Try to change the range of the Edit, by selecting "Range". Check that navigating through the options correctly updates the range shown in the editor.
- [ ] Try to change the model of the Edit, by selecting "Model".
- [ ] Submit edits after changing the above values, and check that the Edit performs correctly (e.g. uses correct range, uses correct context)
- [ ] Verify that the selected configuration is shown in the input after clicking "Retry" on a completed edit.
- [ ] Verify that you can still change the configuration shown in the input after clicking "Retry" on a completed edit.

#### Generating code

- [ ] Move the cursor to an empty line, do not highlight any selection.
- [ ] Verify that the option to run the `Edit Code` command is available from the sidebar, right-click menu, the command palette (option+c, /edit), or Option+K keyboard shortcut.
- [ ] Run the `Edit Code` command with instructions for what Cody should generate.
- [ ] Verify that there is a notification that "Cody is working..." while code is being generated.
- [ ] Verify that, per the user’s instructions, Cody automatically streams the generated code into the document, line-by-line.
- [ ] Verify that you can see a diff view of the edit in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept All`.

### Test

- [ ] Verify that the option to run the `Generate Unit Tests` command is available in the following locations:
  - [ ] Sidebar `Generate Unit Tests`
  - [ ] Context (right-click) menu `Cody > Generate Unit Tests`
  - [ ] Command palette (MetaKey+Shift+p) `Cody Command: Generate Unit Tests`
  - [ ] Cody Command Menu (option+c, `/test`)
- [ ] Highlight a section of code in a file that does not have any test files created.
- [ ] Run the `Generate Unit Tests` command.
- [ ] Verify that an icon appears above the highlighted code with "Cody is working..." while Cody generates the tests.
- [ ] Verify that a new unsaved file is created and opened.
- [ ] Verify that Cody automatically streams the generated tests to the new file.
- [ ] Verify that you can remove the generated tests by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.

### Document

- [ ] Verify that the option to run the `Document Code` command is available in the following locations:
  - [ ] Sidebar `Document Code`
  - [ ] Context (right-click) menu `Cody > Document Code`
  - [ ] Command palette (MetaKey+Shift+p) `Cody Command: Document Code`
  - [ ] Cody Command Menu (option+c, `Document Code`)
- [ ] Highlight a section of code in a file.
- [ ] Run the `Document Code` command.
- [ ] Verify that an icon appears above the highlighted code with "Cody is working..." while Cody generates documentation.
- [ ] Verify that you can see a diff view of the generated documentation in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the documentation by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.
- [ ] Move your cursor inside a function in the file without highlighting code, before running the `Document Code` command again.
- [ ] Verify that Cody adds documentation above the function that contains your cursor.

### Smell

- [ ] Verify that the option to run the `Find Code Smells` command is available in the following locations:
  - [ ] Sidebar `Find Code Smells`
  - [ ] Context (right-click) menu `Cody > Find Code Smells`
  - [ ] Command palette (MetaKey+Shift+p) `Cody Command: Find Code Smells`
  - [ ] Cody Command Menu (option+c, `Find Code Smells`)
- [ ] Highlight a section of code in a file.
- [ ] Run the `Find Code Smells` command.
- [ ] Verify that Cody provides suggestion for how to improve the selected code in a new chat window.
- [ ] Move your cursor inside a function in the file without highlighting code, before running the `Find Code Smells` command again
- [ ] Verify that Cody provides suggestion for how to improve the function that contains your cursor in a new chat window.
- [ ] Verify that the chat executed by running the command is added to the sidebar under `Chats`.

### Code Actions

#### Fixing code

- [ ] Deliberately break a line or section of code to trigger the IDE’s red squiggly error warning.
- [ ] Click the Code Action (in VSC) lightbulb icon in the project file
- [ ] Select `Ask Cody to Fix`.
- [ ] Verify that there is a notification that "Cody is working..." while edits are being applied.
- [ ] Verify that Cody automatically applies a code fix to the selected code.
- [ ] Verify that you can see a diff view of the fix in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the fix by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.

#### Explaining code

- [ ] Deliberately break a line or section of code to trigger the IDE’s red squiggly error warning.
- [ ] Click the Code Action lightbulb icon in the project file
- [ ] Select `Ask Cody to Explain`.
- [ ] Verify that Cody provides an explanation of the error in a new chat window.
- [ ] Verify that the chat executed by running the command appears in the chat list in the left hand panel.

#### Editing

- [ ] Highlight a section of code.
- [ ] Click the Code Action lightbulb icon in the project file
- [ ] Select `Cody: Edit Code`.
- [ ] Provide instructions for how Cody should edit the selected code.
- [ ] Verify that there is a notification that "Cody is working..." while edits are being applied.
- [ ] Verify that Cody automatically applies edits to the selected code, per the user’s instructions
- [ ] Verify that you can see a diff view of the edit in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept All`.

#### Generating code

- [ ] Move the cursor to an empty line, do not highlight any selection.
- [ ] Click the Code Action lightbulb icon in the project file.
- [ ] Select `Cody: Generate Code`.
- [ ] Provide instructions for what Cody should generate.
- [ ] Verify that there is a notification that "Cody is working..." while code is being generated.
- [ ] Verify that, per the user’s instructions, Cody automatically streams the generated code into the document, line-by-line.
- [ ] Verify that you can see a diff view of the edit in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.

#### Documenting code

- [ ] Move the cursor to an active symbol that could be documented (e.g. a function name), do not highlight any selection.
- [ ] Click the Code Action lightbulb icon in the project file.
- [ ] Select `Cody: Generate Documentation for symbolName`.
- [ ] Verify that there is a notification that "Cody is working..." while code is being generated.
- [ ] Verify that Cody automatically applies documentation to the selected symbol, per the user’s instructions
- [ ] Verify that you can see a diff view of the edit in a new tab by clicking `Show diff`.
- [ ] Verify that you can prompt Cody to retry the command by clicking `Retry` and entering new instructions.
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.

#### Testing code

- [ ] Move the cursor to an active symbol that could be documented (e.g. a function name), do not highlight any selection.
- [ ] Click the Code Action lightbulb icon in the project file.
- [ ] Select `Cody: Generate Tests for symbolName`.
- [ ] Verify that there is a notification: "Cody is working..." while command is being processed.
- [ ] Verify that Cody opens a new file, and automatically streams the generated tests into said file, line-by-line.
- [ ] Verify that there is a notification: "Generating Tests..." while the output is beign produced
- [ ] Verify that you can undo the edit by clicking `Undo`.
- [ ] Verify that the ghost text disappears by clicking `Accept`.

### Custom Commands

#### Create a custom command from the command palette

- [ ] In your command palette, search for `Cody Command: Custom Commands` to open the Custom Command Menu.
- [ ] Select `Configure Custom Commands`.
- [ ] Select `New Custom Command`.
- [ ] Enter the title of a new custom command (e.g., `correct`) and press enter.
- [ ] Verify that you cannot use a title that already exists.
- [ ] Enter the instructions that Cody should follow (e.g., `Correct any spelling mistakes`).
- [ ] Select the context that Cody should use with the instructions (e.g., `selection`).
- [ ] Choose where to save the command (`User Settings` or `Workspace Settings`).
- [ ] Click the `Custom Commands` command in the Cody sidebar to open the Custom Command Menu.
- [ ] Verify `correct` command shows up in the menu.

#### Create a custom command by editing the configuration JSON file

##### User Custom Commands

- [ ] Click on `Custom Commands` in the Cody sidebar to open the Custom Command Menu.
- [ ] Select “Configure Custom Commands”.
- [ ] Select “Open User Settings (JSON)”.
- [ ] Add a new user custom command:

```json
{
  "commands": {
    "summarize": {
      "prompt": "Summarize the share context in 3-5 sentences",
      "context": {
        "currentFile": true
      }
    }
  }
}
```

##### Workspace Custom Commands

- [ ] Click on `Custom Commands` in the Cody sidebar to open the Custom Command Menu.
- [ ] Select “Configure Custom Commands”.
- [ ] Select “Open Workspace Settings (JSON)”.
- [ ] Add a new workspace custom command:

```json
{
  "commands": {
    "checker": {
      "prompt": "Check for spelling mistakes in the share context",
      "context": {
        "selection": true
      }
    }
  }
}
```

#### Verify custom command

- [ ] Click on `Custom Commands` in the Cody sidebar to open the Custom Command Menu.
- [ ] Verify `summarize` and `checker` are available in the menu.
- [ ] Select the newly created commands to run the custom command.
- [ ] Verify the responses show up in a new chat window and the responses align with the prompt of the commands. (E.g., for the `summarize` command above, you should see Cody summarize the current file in the output).

## Chat

### Chat UX

- [ ] Verify that you can open a new chat window by selecting `New Chat` in the `Commands` left hand panel, hovering over the header in the `Chats` left hand panel, or with the option+/ keyboard shortcut.
- [ ] Ask Cody a question in the chat window. The question should include a request for Cody to generate code.
- [ ] Verify that Cody has a loading state when generating a response.
- [ ] Verify that you can stop Cody from continuing to generate a response.
- [ ] Verify that you can select options to insert the code at the cursor in the file, copy the code to your clipboard, or create a new file containing the generated code.
- [ ] Verify that you can ask Cody a follow-up question within the same chat window and that Cody will generate a response.
- [ ] Verify that you can edit a previous chat prompt and get a new answer from Cody.

### LLM Selection

- [ ] Sign in as a Free user, open a new chat, and verify that the default LLM is Claude 2, and there is no option to switch LLMs (without upgrading to Pro).
- [ ] Sign in as a Pro user and verify that there is a list of LLM options and you can switch between them.
- [ ] Sign in as an enterprise user and verify that you cannot change the LLM.

## Autocomplete

Primary languages to test: Javascript, Typescript, TypescriptReact, Python, Go

### Manual trigger key binding

- [ ] Log in to the VS Code extension as a Free user.
- [ ] Generate a completion using the manual-trigger key binding.
- [ ] Verify that the completion is generated at the current cursor position.

### Language ignore list

- [ ] Log in to the VS Code extension as a Free user.
- [ ] Generate completion for file in the X programming language.
- [ ] Open VS Code settings, find the language ignore list, and add this language to the list
- [ ] Verify that completions are no longer generated for this language.

### LLM selection

- [ ] Log in to the VS Code extension as a Free user.
- [ ] Generate completion using the LLM selected by default.
- [ ] Open VS Code settings and find Cody autocomplete mode settings.
  - Combinations to test:
    - [ ] Provider: fireworks; Model: starcoder-16 and starcoder-7b
    - [ ] Provider: anthropic; Model: null
- [ ] Verify that autocomplete works as expected after the settings change.

### Multi-line completions

- [ ] Open a TypeScript file. Paste in something like this: `function bubbleSort(`.
- [ ] Expect more than one line of code being completed for you.

### Telemetry and analytics:

- [ ] Open the Autocomplete Trace View (cmd+shift+p “trace view”)
- [ ] In another editor tab, trigger an autocomplete request.
- [ ] Expect the number of shown/accepted completions to update accordingly.
