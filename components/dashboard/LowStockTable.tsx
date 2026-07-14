import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const products = [
  { name: "SSD Kingston", stock: 2 },
  { name: "Monitor Samsung", stock: 1 },
  { name: "Mouse Logitech", stock: 4 },
];

export function LowStockTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos con bajo stock</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="flex justify-between border-b pb-2"
            >
              <span>{product.name}</span>

              <span className="font-semibold text-red-500">
                {product.stock}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}