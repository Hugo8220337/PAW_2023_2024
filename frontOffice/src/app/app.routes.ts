import { Routes } from '@angular/router';

// rotas
import { HomeModule } from './routes/home/home.module';
import { AuthModule } from './routes/auth/auth.module'
import { DonorModule } from './routes/donor/donor.module';
import { EntityModule } from './routes/entity/entity.module';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => HomeModule
    },
    {
        path: 'auth',
        loadChildren: () => AuthModule
    },
    {
        path: 'donor',
        loadChildren: () => DonorModule
    },
    {
        path: 'entity',
        loadChildren: () => EntityModule
    },
    {
        path: '**',
        // redirectTo: '/'
        title: "404 - Not Found",
        component: NotFoundPageComponent,
    }
];
