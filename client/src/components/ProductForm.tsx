import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Product } from "@shared/schema";

const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be at least 1"),
  category: z.string().min(1, "Category is required"),
  brand: z.enum(["FitsNew", "FitsAgain"]),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  isFeatured: z.boolean(),
  isTrending: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

const categories = ["T-Shirts", "Shirts", "Jeans", "Jackets", "Pants", "Vintage"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand as "FitsNew" | "FitsAgain",
      sizes: product.sizes,
      images: product.images,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
    } : {
      title: "",
      description: "",
      price: 0,
      category: "",
      brand: "FitsNew",
      sizes: [],
      images: [],
      stock: 0,
      isFeatured: false,
      isTrending: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (product) {
        return apiRequest("PATCH", `/api/products/${product.id}`, data);
      }
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Product updated" : "Product created",
        description: product ? "Product has been updated successfully" : "Product has been created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  const handleSizeToggle = (size: string, checked: boolean) => {
    const currentSizes = form.getValues("sizes");
    if (checked) {
      form.setValue("sizes", [...currentSizes, size]);
    } else {
      form.setValue("sizes", currentSizes.filter(s => s !== size));
    }
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="Classic White T-Shirt" {...field} data-testid="input-title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Comfortable cotton t-shirt perfect for everyday wear..."
                  rows={4}
                  {...field}
                  data-testid="input-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="999"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    data-testid="input-price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    data-testid="input-stock"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FitsNew">FitsNew</SelectItem>
                    <SelectItem value="FitsAgain">FitsAgain</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sizes"
          render={() => (
            <FormItem>
              <FormLabel>Available Sizes</FormLabel>
              <div className="flex gap-4 flex-wrap">
                {sizes.map((size) => (
                  <FormField
                    key={size}
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(size)}
                            onCheckedChange={(checked) =>
                              handleSizeToggle(size, checked as boolean)
                            }
                            data-testid={`checkbox-size-${size}`}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{size}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <div className="space-y-3">
                {field.value.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <img src={url} alt={`Product ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                    <Input value={url} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      data-testid={`button-remove-image-${index}`}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  data-testid="button-add-image"
                >
                  Add Image URL
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-featured"
                  />
                </FormControl>
                <FormLabel className="font-normal">Featured</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTrending"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-trending"
                  />
                </FormControl>
                <FormLabel className="font-normal">Trending</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending} data-testid="button-submit">
            {mutation.isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess} data-testid="button-cancel">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
