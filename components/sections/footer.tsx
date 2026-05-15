'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-black">e</div>
              <span className="font-mono font-bold">eevolvv</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              AI-powered business automation. We watch, we build, we deploy.
            </p>
            <p className="text-gray-600 text-xs">
              eevolvv, Inc.<br />
              Delaware C Corp
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#how-it-works" className="text-gray-500 hover:text-cyan-500 transition-colors">How It Works</Link></li>
              <li><Link href="#industries" className="text-gray-500 hover:text-cyan-500 transition-colors">Industries</Link></li>
              <li><Link href="#pricing" className="text-gray-500 hover:text-cyan-500 transition-colors">Pricing</Link></li>
              <li><Link href="/diagnostic/1" className="text-gray-500 hover:text-cyan-500 transition-colors">Sample Report</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-500 hover:text-cyan-500 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Get In Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+18444338658" className="text-gray-500 hover:text-cyan-500 transition-colors">
                  +1 (844) 433-8658
                </a>
              </li>
              <li>
                <a href="mailto:hello@eevolvv.com" className="text-gray-500 hover:text-cyan-500 transition-colors">
                  hello@eevolvv.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} eevolvv, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span>Built with 🤖 in Dallas, TX</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
