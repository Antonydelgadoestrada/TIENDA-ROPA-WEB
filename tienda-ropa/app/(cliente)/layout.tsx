import HeaderPremium from '@/app/components/HeaderPremium'
import FooterPremium from '@/app/components/FooterPremium'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderPremium />
      <main className="flex-1">{children}</main>
      <FooterPremium />
    </>
  )
}
