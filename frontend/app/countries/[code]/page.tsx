export default async function countriesCode({ params }: { params: { code: string } }) {
    const { code } = await params
    return (
        <div>
            commodities by hs code
        </div>
    )
}