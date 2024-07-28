interface CharityModel {
    id:string;
    name: string;
    date: string;
    cause: string;
    amount: string;
    description: string;
    photoUrl:string;
}

interface CharityUploadModel{
    description: string;
    date: string;
    image: string;
    id?: string;
}

interface AchievementsUploadModel{
    description: string;
    date: string;
    image: string;
    id?: string;
}


export type {CharityModel,CharityUploadModel,AchievementsUploadModel};