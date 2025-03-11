// lib/withSetupCheck.ts
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { prisma } from "@/lib/prisma";

export function withSetupCheck<P extends { [key: string]: any; }>(
    gssp: GetServerSideProps<P>
): GetServerSideProps<P> {
    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        // Проверяем состояние настройки из базы данных
        const isSetUp = await prisma.setting.findUnique({
            where: { setting_key: "is_set_up" },
        });

        if (!isSetUp || isSetUp.setting_value !== "true") {
            // Если сайт не настроен, делаем редирект на страницу установки
            return {
                redirect: {
                    destination: "/setup",
                    permanent: false,
                },
            };
        }

        // Если всё нормально — передаём управление исходной функции
        return await gssp(context);
    };
}