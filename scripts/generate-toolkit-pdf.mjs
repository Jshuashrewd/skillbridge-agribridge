// Generates the one real Toolkits resource: a practical one-pager derived
// directly from Lesson 2 (Calls, SMS & Mobile Money Basics) and Lesson 4
// (Staying Safe Online) of Course 201 — not filler/lorem ipsum. Run with:
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
doc.text('Digital Literacy Toolkit', margin, 62)

y = 130
heading('Mobile Money Safety Checklist')
doc.setFont('helvetica', 'normal')
doc.setFontSize(10.5)
doc.setTextColor(NEUTRAL_600)
y += 6
doc.text('A quick-reference companion to "Calls, SMS & Mobile Money Basics"', margin, y + 12)
y += 12

subheading('Before you send money')
bullet("Confirm the recipient's number is correct — read it back digit by digit before confirming.")
bullet('Confirm the exact amount on the screen before you enter your PIN.')
bullet('Know the transaction fee, if any, so the final debit does not surprise you.')

subheading('USSD basics')
bullet('USSD codes (like *737#) are short dial codes for mobile money, airtime, and balance checks — confirm the exact code for your own network provider.')
bullet('Check your balance before and after a transfer to make sure it matches what you expect.')

subheading('Red flags — never do these')
bullet('Never share your mobile money PIN with anyone — including someone claiming to be your bank or network provider.')
bullet('Be suspicious of unsolicited "you’ve won a prize" messages asking you to reply or send money.')
bullet('If a message urgently pressures you to act "right now," slow down and verify before doing anything.')

subheading('After the transaction')
bullet('Save or screenshot the confirmation SMS.')
bullet('Check that your new balance matches what you expect.')

y += 30
doc.setDrawColor('#d8e0dc')
doc.line(margin, y, pageWidth - margin, y)
y += 20
doc.setFont('helvetica', 'italic')
doc.setFontSize(9)
doc.setTextColor(NEUTRAL_600)
doc.text(
  'Part of the SkillBridge curriculum — UI/UX Design Fundamentals (Course 101), Lesson 2.',
  margin,
  y,
)

const outPath = join(outDir, 'mobile-money-safety-checklist.pdf')
writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')))
console.log(`✔ Wrote ${outPath}`)
