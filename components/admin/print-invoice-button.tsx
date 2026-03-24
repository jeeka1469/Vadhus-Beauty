'use client'

export function PrintInvoiceButton() {
  return (
    <button
      className="fixed bottom-5 right-5 rounded-lg bg-[#4a8fe0] px-6 py-3 text-sm text-white shadow-md transition-colors hover:bg-[#3c79bf] print:hidden"
      onClick={() => {
        window.print()
      }}
    >
      Print Invoice
    </button>
  )
}
