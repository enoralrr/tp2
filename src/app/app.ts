import { Component, signal, computed } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export type TaskFilter = 'todo' | 'done' | 'all';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Liste de toutes les tâches
  readonly tasks = signal<Task[]>([ 
    { id: 1, title: 'tache1', done: true },
    { id: 2, title: 'tache2', done: true },
    { id: 3, title: 'tache3', done: false }
  ]);

  // Affichage du formulaire de création de tâche
  readonly showCreateForm = signal(true);

  // Le titre saisi par l'utilisateur pour une nouvelle tâche
  readonly newTitle = signal('');

  // Gestion de la modification d'une tâche
  readonly editingTaskId = signal<number | null>(null);
  readonly editingTitle = signal('');

  // Filtre actif : 'all' (toutes), 'todo' (à faire) ou 'done' (faites)
  readonly filter = signal<TaskFilter>('all');

  // Compteurs calculés automatiquement via computed()
  readonly todoCount = computed(() =>
    this.tasks().filter(task => !task.done).length
  );

  readonly doneCount = computed(() =>
    this.tasks().filter(task => task.done).length
  );

  readonly totalCount = computed(() =>
    this.tasks().length
  );

  // Validation : le titre doit contenir au moins 3 caractères (sans les espaces)
  readonly isTitleValid = computed(() =>
    this.newTitle().trim().length >= 3
  );

  // Validation pour la modification : au moins 3 caractères
  readonly isEditTitleValid = computed(() =>
    this.editingTitle().trim().length >= 3
  );

  // Afficher l'erreur si l'utilisateur a saisi du texte mais moins de 3 caractères
  readonly showTitleError = computed(() => {
    const trimmed = this.newTitle().trim();
    return this.newTitle().length > 0 && trimmed.length < 3;
  });

  // Tâches filtrées selon le filtre sélectionné
  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const currentFilter = this.filter();

    if (currentFilter === 'todo') {
      return tasks.filter(task => !task.done);
    }
    if (currentFilter === 'done') {
      return tasks.filter(task => task.done);
    }
    return tasks;
  });

  // Basculer l'affichage du bloc "Créer une tâche"
  toggleCreateForm(): void {
    this.showCreateForm.update(open => !open);
  }

  // Définir ou décocher le filtre (décocher remet à 'all' pour tout voir)
  setFilter(selected: TaskFilter): void {
    if (this.filter() === selected) {
      // Si on décoche le filtre actif, on réaffiche toutes les tâches
      this.filter.set('all');
    } else {
      this.filter.set(selected);
    }
  }

  // Créer et ajouter la nouvelle tâche
  create(): void {
    const title = this.newTitle().trim();
    if (title.length < 3) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      done: false
    };

    this.tasks.update(tasks => [...tasks, newTask]);

    // Réinitialiser le champ texte
    this.newTitle.set('');
  }

  // Cocher ou décocher une tâche
  toggleTask(id: number): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  // Supprimer une tâche
  deleteTask(id: number): void {
    if (this.editingTaskId() === id) {
      this.cancelEdit();
    }
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  // Commencer la modification d'une tâche
  startEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.editingTitle.set(task.title);
  }

  // Valider et enregistrer la modification
  saveEdit(id: number): void {
    const title = this.editingTitle().trim();
    if (title.length < 3) {
      return;
    }

    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, title } : task
      )
    );
    this.cancelEdit();
  }

  // Annuler la modification
  cancelEdit(): void {
    this.editingTaskId.set(null);
    this.editingTitle.set('');
  }
}
