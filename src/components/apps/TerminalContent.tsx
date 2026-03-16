import { useState, useRef, useEffect } from 'react'

type Line = { type: 'input' | 'output'; text: string }

type TerminalContentProps = {
  onOpenWindow?: (appId: string, title: string) => void
  onOpenUrl?: (url: string) => void
}

const ABOUT_TEXT = `Irakli Kalmikov — Full stack developer (React, Python, React Native).
Building web apps, APIs, and mobile apps. Based in NY.`

const HELP_TEXT = `Commands: ls, cat about, open resume, open projects, open linkedin, open github, help`

export function TerminalContent({ onOpenWindow, onOpenUrl }: TerminalContentProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: 'Type "help" for commands.' },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines])

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const command = parts[0]
    const args = parts.slice(1)

    if (!command) {
      setLines((prev) => [
        ...prev,
        { type: 'input', text: `$ ${cmd}` },
        { type: 'output', text: '' },
      ])
      return
    }

    let output: string[] = []

    switch (command) {
      case 'ls':
        output = ['about', 'projects', 'resume']
        break
      case 'cat':
        if (args[0] === 'about') output = [ABOUT_TEXT]
        else output = [`cat: ${args[0] ?? ''}: No such file`]
        break
      case 'open':
        if (args[0] === 'resume') {
          onOpenWindow?.('preview', 'Resume')
          output = ['Opening Preview...']
        } else if (args[0] === 'projects' || args[0] === 'finder') {
          onOpenWindow?.('finder', 'Finder')
          output = ['Opening Finder...']
        } else if (args[0] === 'linkedin') {
          onOpenUrl?.('https://linkedin.com/in/ikalmikov')
          output = ['Opening LinkedIn...']
        } else if (args[0] === 'github') {
          onOpenUrl?.('https://github.com/ikalmikov16')
          output = ['Opening GitHub...']
        } else {
          output = [`open: ${args[0] ?? ''}: unknown target`]
        }
        break
      case 'help':
        output = [HELP_TEXT]
        break
      default:
        output = [`${command}: command not found`]
    }

    setLines((prev) => [
      ...prev,
      { type: 'input', text: `$ ${cmd}` },
      ...output.map((t) => ({ type: 'output' as const, text: t })),
    ])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    runCommand(input)
    setInput('')
  }

  return (
    <div className="terminal">
      <div className="terminal-output" ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line terminal-line--${line.type}`}>
            {line.text}
          </div>
        ))}
      </div>
      <form className="terminal-input-row" onSubmit={handleSubmit}>
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
          aria-label="Terminal input"
        />
      </form>
    </div>
  )
}
