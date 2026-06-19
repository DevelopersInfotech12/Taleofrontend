import CollectionScreen from "../../screens/CollectionScreen";

export default function Page({ params }) {
  return <CollectionScreen collectionSlug={params.slug} />;
}
