export default async function commoditiesHsCode({ params }: { params: { hsCode: string } }) {
    const { hsCode } = await params
    return (
        <div>
            commodities by hs code
        </div>
    )
}