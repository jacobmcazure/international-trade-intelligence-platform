export default async function sanctionsID({ params }: {params: { id: string } }) {
    const { id } = await params
    return (
        <div>
            sanctions by ID
        </div>
    )
}