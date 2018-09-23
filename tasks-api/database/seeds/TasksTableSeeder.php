<?php

use App\Status;
use App\Task;
use Illuminate\Database\Seeder;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $task1 = new Task();
        $task1->summary = 'Task 1';
        $task1->save();
        $s = new Status;
        $s->task_id = 1;
        $s->name = 'Pending';
        $s->code = false;
        $s->save();
        $task1->status()->save($s);

        $task2 = new Task();
        $task2->summary = 'Task 2';
        $task2->save();
        $s1 = new Status;
        $s1->task_id = 2;
        $s1->name = 'Pending';
        $s1->code = false;
        $s1->save();
        $task2->status()->save($s1);

        $task3 = new Task();
        $task3->summary = 'Task 3';
        $task3->save();
        $s2 = new Status;
        $s2->task_id = 3;
        $s2->name = 'Pending';
        $s2->code = false;
        $s2->save();
        $task3->status()->save($s2);
    }
}
