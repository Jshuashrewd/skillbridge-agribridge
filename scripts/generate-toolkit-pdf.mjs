// Generates the one real Toolkits resource: a practical one-pager derived
// directly from Lesson 3 (The Design Process) and Lesson 5 (Wireframing in
// Practice) of course-101 — not filler/lorem ipsum. Run with:
//
//   node scripts/generate-toolkit-pdf.mjs

import { jsPDF } from 'jspdf'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'toolkits')
mkdirSync(outDir, { recursive: true })

const GREEN_900 = '#0f3d2e'
const GREEN_700 = '#155c3a'
const NEUTRAL_950 = '#12231b'
const NEUTRAL_600 = '#52625a'

const doc = new jsPDF({ unit: 'pt', format: 'a4' })
const pageWidth = doc.internal.pageSize.getWidth()
const margin = 56
const contentWidth = pageWidth - margin * 2
let y = 0

function heading(text) {
  y += 26
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(GREEN_900)
  doc.text(text, margin, y)
}

function subheading(text) {
  y += 26
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(GREEN_700)
  doc.text(text, margin, y)
}

function bullet(text) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(NEUTRAL_950)
  const lines = doc.splitTextToSize(text, contentWidth - 16)
  y += 16
  doc.setFillColor(GREEN_700)
  doc.circle(margin + 3, y - 3, 2, 'F')
  doc.text(lines, margin + 14, y)
  y += (lines.length - 1) * 13
}

// Header band
doc.setFillColor(GREEN_900)
doc.rect(0, 0, pageWidth, 90, 'F')
doc.setFont('helvetica', 'bold')
doc.setFontSize(18)
doc.setTextColor('#ffffff')
doc.text('SkillBridge', margin, 40)
doc.setFont('helvetica', 'normal')
doc.setFontSize(11)
doc.setTextColor('#cbe4d4')
doc.text('UI/UX Design Toolkit', margin, 62)

y = 130
heading('Design Process & Wireframing Quick Reference')
doc.setFont('helvetica', 'normal')
doc.setFontSize(10.5)
doc.setTextColor(NEUTRAL_600)
y += 6
doc.text('A quick-reference companion to "The Design Process" and "Wireframing in Practice"', margin, y + 12)
y += 12

subheading('The four stages')
bullet('Discover — research the problem before proposing any solution.')
bullet('Define — frame the right problem to solve, based on what research turned up.')
bullet('Develop — explore and prototype multiple possible solutions.')
bullet('Deliver — test with real users, refine, and ship.')

subheading('Keep it iterative')
bullet('Test early, rough ideas with real users instead of polishing in isolation.')
bullet('Be ready to loop back to Discover or Define if testing reveals a better problem to solve.')

subheading('Wireframing basics')
bullet('Start with rough boxes and labels — resist the urge to pick colors or fonts yet.')
bullet('Focus each wireframe on layout, hierarchy, and flow between screens.')
bullet('Add just enough detail to communicate the idea to a reviewer or teammate.')

subheading('Moving to high fidelity')
bullet('Validate the layout and flow with a wireframe first.')
bullet('Only move to color, type, and visual polish once the structure is confirmed.')

y += 30
doc.setDrawColor('#d8e0dc')
doc.line(margin, y, pageWidth - margin, y)
y += 20
doc.setFont('helvetica', 'italic')
doc.setFontSize(9)
doc.setTextColor(NEUTRAL_600)
doc.text(
  'Part of the SkillBridge curriculum — UI/UX Design Fundamentals (Course 101), Lessons 3 & 5.',
  margin,
  y,
)

const outPath = join(outDir, 'design-process-wireframing-reference.pdf')
writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
console.log(`✔ Wrote ${outPath}`)
