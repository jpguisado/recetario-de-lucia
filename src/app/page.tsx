import { ReceiptText } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { fetchTodaysMeals } from "~/server/data-layer";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import Link from "next/link";

export default async function HomePage() {
  const todaysMeals = await fetchTodaysMeals();
  console.log(todaysMeals)
  return (
    <main className="flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold pt-12 p-6">Hoy comemos:</h1>
      <div className="px-6 flex flex-col gap-3 pb-12">
        {
          todaysMeals?.map((meals => {
            return (
              <Card key={meals.id}>
                <CardHeader>
                  <CardTitle>{meals.meal}</CardTitle>
                  <CardDescription>{meals.dish?.name ? meals.dish?.name : <Link href={'/server-designer'}>Planificar</Link>}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  {meals.dish?.recipe ? (
                    <Drawer>
                      <DrawerTrigger><Button variant={"outline"}><ReceiptText /></Button></DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{meals.dish?.name}</DrawerTitle>
                          <DrawerDescription>{meals.dish?.recipe}</DrawerDescription>
                        </DrawerHeader>
                      </DrawerContent>
                    </Drawer>
                  ) : ''}
                </CardFooter>
              </Card>
            )
          }))
        }
      </div>
    </main>
  );
}
