import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/category";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    // check user session
    if (!session?.user || session.user.role !== "ADMIN")
      return new Response("Unauthorized", { status: 401 });

    // parse request
    const body = await req.json();
    console.log("body", body);
    const { categoryId, filter } = body;

    const { id, name, fieldType, availableChoices } = filter;

    console.log("availableChoices", availableChoices);

    // Sprawdź, czy filtr CustomFilter już istnieje
    let existingCustomFilter = await db.customFilter.findFirst({
      where: { name, categoryId },
    });

    if (existingCustomFilter) {
      // Jeśli filtr istnieje, zaktualizuj go
      existingCustomFilter = await db.customFilter.update({
        where: { id: existingCustomFilter.id },
        data: { categoryId, fieldType },
      });
    } else {
      // Jeśli filtr nie istnieje, utwórz nowy
      existingCustomFilter = await db.customFilter.create({
        data: { categoryId, name, fieldType },
      });
    }

    if (existingCustomFilter && existingCustomFilter.id) {
      if (existingCustomFilter.fieldType === "SELECT") {
        const filterOptions = availableChoices.map(async (option: any) => {
          console.log("option", option);
          // Jeśli opcja nie istnieje, utwórz nową
          await db.filterOption.create({
            data: {
              option: existingCustomFilter!.fieldType,
              customFilterId: existingCustomFilter!.id,
              availableChoices: option?.option,
            },
          });
        });
        await Promise.all(filterOptions);
      } else if (existingCustomFilter.fieldType === "NUMERIC") {
        console.log("availableChoices[0].option:", availableChoices[0].option);
        const existingOption = await db.filterOption.findFirst({
          where: { customFilterId: existingCustomFilter!.id },
        });

        if (existingOption) {
          // Jeśli opcja istnieje, zaktualizuj ją
          await db.filterOption.update({
            where: { id: existingOption.id },
            data: {
              choiceFrom: availableChoices[0].option,
              choiceTo: availableChoices[1].option,
            },
          });
        } else {
          // Jeśli opcja nie istnieje, utwórz nową
          await db.filterOption.create({
            data: {
              option: existingCustomFilter!.fieldType,
              customFilterId: existingCustomFilter!.id,
              choiceFrom: parseFloat(availableChoices[0].choiceFrom),
              choiceTo: parseFloat(availableChoices[0].choiceTo),
            },
          });
        }
      }
    }

    return new Response("ok");
  } catch (error: any) {
    // handle errors
    return new Response(error.message, { status: 422 });
  }
}
