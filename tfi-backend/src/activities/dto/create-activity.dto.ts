export class CreateActivityDto {
    description: string;
    priority: 'Alta' | 'Media' | 'Baja';
    responsibleUser: string;
}