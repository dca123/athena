import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { getDataProduct } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

type DataProductDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataProductId: string | null;
};

export function DataProductDetails(props: DataProductDetailsProps) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent blur={false}>
        <SheetData dataProductId={props.dataProductId} />
      </SheetContent>
    </Sheet>
  );
}

type SheetDataProps = {
  dataProductId: string | null;
};
function SheetData(props: SheetDataProps) {
  const query = useQuery({
    queryKey: ['dataProducts', props.dataProductId],
    queryFn: () => getDataProduct(props.dataProductId as string),
    enabled: props.dataProductId !== null,
  });

  if (query.isPending) {
    return <Skeleton />;
  }

  if (query.isError) {
    return <div className="text-red-400">Error - {query.error.message}</div>;
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{query.data.name}</SheetTitle>
        <SheetDescription>{query.data.description}</SheetDescription>
      </SheetHeader>
      <div className="pt-4 space-y-4">
        <div>
          <h2 className="text-muted-foreground">Tags</h2>
          {query.data.tagRelations.length === 0 ? (
            <p className="text-foreground">No tags</p>
          ) : null}
          <ul>
            {query.data.tagRelations.map((tagRelation) => (
              <li className="text-foreground" key={tagRelation.tag.id}>
                {tagRelation.tag.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-muted-foreground">Owners</h2>
          <ul>
            {query.data.owners.map((owner) => (
              <li key={owner} className="text-foreground">
                {owner}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-muted-foreground">Inputs</h2>
          {query.data.sourceRelations.length === 0 ? (
            <p className="text-foreground">No inputs</p>
          ) : null}
          <ul>
            {query.data.sourceRelations.map((sourceRelation) => (
              <li className="text-foreground" key={sourceRelation.source.id}>
                {sourceRelation.source.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-muted-foreground">Outputs</h2>
          {query.data.targetRelations.length === 0 ? (
            <p className="text-foreground">No inputs</p>
          ) : null}
          <ul>
            {query.data.targetRelations.map((targetRelation) => (
              <li className="text-foreground" key={targetRelation.target.id}>
                {targetRelation.target.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
