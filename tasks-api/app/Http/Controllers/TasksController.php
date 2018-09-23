<?php

namespace App\Http\Controllers;

use App\Status;
use App\Task;
use Illuminate\Http\Request;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;

class TasksController extends Controller
{
    public function index()
    {
        $fractal = new Manager();
        $tasks = Task::with('status')->get()->toArray();
        $resource = new Collection($tasks, function (array $task) {
            return [
                'id' => (int) $task['id'],
                'summary' => $task['summary'],
                'description' => $task['desc'],
                'due_date' => $task['due_date'],
                'status' => [
                    'name' => $task['status']['name'],
                    'code' => $task['status']['code'],
                ],
            ];
        });
        return $fractal->createData($resource)->toJson();
    }

    public function create(Request $request)
    {
        $task = new Task();
        $task->summary = $request->summary;
        $task->desc = $request->desc;
        $task->due_date = \Carbon\Carbon::createFromFormat('m/d/Y', $request->date)->toDateTimeString(); // i.e. 9/20/2018
        $task->save();
        $status = new Status;
        $status->task_id = $task->id;
        $status->name = 'Pending';
        $status->code = false;
        $status->save();
        $task->status()->save($status);
        return $task;
    }

    public function show($id)
    {
        $task = Task::find($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        $task->summary = $request->summary;
        $task->desc = $request->desc;
        $task->due_date = \Carbon\Carbon::createFromFormat('m/d/Y', $request->date)->toDateTimeString(); // i.e. 9/20/2018
        $task->save();
        return $task;
    }

    public function destroy($id)
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();
            return $task;
        } catch (Exception $e) {
            return [
                'message' => 'Task not found!',
            ];
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::find($id);
        $task->status->name = $request->name;
        $task->status->code = $request->code;
        $task->status->save();
        return $task;
    }
}
