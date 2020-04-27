import { expose } from 'ramodel/remote/worker';
import { TodoManager } from './models/TodoManager';

const localWorld = expose();

localWorld.set('manager', new TodoManager({}));
