import { useRequest, useToggle } from "ahooks";
import { useEffect, useState } from "react";
import info from '../../../package.json';
import { tasks as tasksApi } from "../../services/lf";
import type { Complexity, RankedTask } from "../../types/task";
import { rankTasks } from "../../utils/ranking";
import ControlsPanel from "./components/ControlsPanel";
import CreateTaskModal from "./components/CreateTaskModal";
import TaskDetailPanel from "./components/TaskDetailPanel";
import TaskListPanel from "./components/TaskListPanel";
import { usePlanetManager } from "./hooks/usePlanetManager";
import { useSceneAnimation } from "./hooks/useSceneAnimation";
import { useSceneInteraction } from "./hooks/useSceneInteraction";
import { useTaskOperations } from "./hooks/useTaskOperations";
import { useThreeScene } from "./hooks/useThreeScene";
import { useUIControls } from "./hooks/useUIControls";

function planetSize(complexity: Complexity): number {
  return 0.6 + complexity * 0.3;
}

export default function SolarSystem() {
  const { sceneDataRef, containerRef } = useThreeScene();

  const { data: { data: tasks = [] } = {}, mutate: setTasks, loading: loadingTasks } = useRequest(
    tasksApi.tasksControllerFindAll,
    {
      defaultParams: [{ limit: 1000, offset: 0 }],
      onSuccess: ({ data }) => console.log("Tasks loaded:", data.length),
    },
  );

  const [selectedTask, setSelectedTask] = useState<RankedTask | null>(null);
  const [showCreateModal, { set: setShowCreateModal }] = useToggle(false);
  const [showTaskPanel, { set: setShowTaskPanel }] = useToggle(false);
  const [uiHidden, { toggle: toggleUI, set: setUiHidden }] = useToggle(false);

  const uiControls = useUIControls(sceneDataRef);

  const taskOps = useTaskOperations(
    tasks,
    setTasks,
    setShowCreateModal,
    setShowTaskPanel,
    setSelectedTask,
  );

  const { updatePlanets } = usePlanetManager(sceneDataRef, tasks);

  useEffect(() => {
    updatePlanets();
  }, [updatePlanets]);

  useSceneAnimation(sceneDataRef);

  const stopFollowing = () => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    sd.followingPlanet = null;
    sd.lastPlanetPosition.set(0, 0, 0);
    sd.camera.position.set(0, 30, 70);
    sd.controls.target.set(0, 0, 0);
    sd.controls.update();
  };

  useSceneInteraction({
    sceneDataRef,
    setSelectedTask,
    setShowTaskPanel,
    toggleUI,
    setShowCreateModal,
    setIsPaused: uiControls.setIsPaused,
    setShowLabelsState: uiControls.setShowLabelsState,
    setShowMoonLabelsState: uiControls.setShowMoonLabelsState,
    setShowOrbitsState: uiControls.setShowOrbitsState,
    stopFollowing,
  });

  const handleFollowPlanet = (task: RankedTask) => {
    const sd = sceneDataRef.current;
    if (!sd) return;
    const planetData = sd.planets.find((p) => p.task.id === task.id);
    if (!planetData) return;
    const size = planetSize(task.complexity as Complexity);
    const distance = Math.max(size * 8, 15);
    sd.followOffset.set(distance, distance * 0.5, distance);
    sd.lastPlanetPosition.set(0, 0, 0);
    sd.followingPlanet = planetData;
  };

  const rankedTasks = rankTasks(tasks);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      />

      {uiHidden && (
        <button className="show-ui-btn" onClick={() => setUiHidden(false)}>
          Show UI (H)
        </button>
      )}

      <ControlsPanel
        uiHidden={uiHidden}
        isPaused={uiControls.isPaused}
        onTogglePause={uiControls.handleTogglePause}
        animationSpeed={uiControls.animationSpeed}
        onSpeedChange={uiControls.handleSpeedChange}
        isBloomManual={uiControls.bloomManualState || false}
        manualBloomStrength={uiControls.manualBloomStrength}
        onBloomStrengthChange={uiControls.handleBloomStrengthChange}
        showLabels={uiControls.showLabelsState || false}
        onToggleLabels={uiControls.handleToggleLabels}
        showMoonLabels={uiControls.showMoonLabelsState || false}
        onToggleMoonLabels={uiControls.handleToggleMoonLabels}
        showOrbits={uiControls.showOrbitsState || false}
        onToggleOrbits={uiControls.handleToggleOrbits}
        showMoons={uiControls.showMoonsState || false}
        onToggleMoons={uiControls.handleToggleMoons}
        onResetCamera={stopFollowing}
        onToggleUI={() => setUiHidden(true)}
        onOpenCreateModal={() => {
          setShowCreateModal(true);
          taskOps.resetForm();
        }}
      />

      <TaskListPanel
        uiHidden={uiHidden}
        rankedTasks={rankedTasks}
        selectedTask={selectedTask}
        onSelectTask={(task) => {
          setSelectedTask(task);
          if (task) {
            setShowTaskPanel(true);
            handleFollowPlanet(task);
          }
        }}
      />

      {showTaskPanel && selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => {
            setShowTaskPanel(false);
            setSelectedTask(null);
          }}
          onToggleComplete={() => taskOps.toggleComplete(selectedTask.id)}
          onDelete={() => taskOps.deleteTask(selectedTask.id)}
          onUpdate={(updates) => taskOps.handleTaskUpdate(selectedTask, updates)}
          onToggleSubtask={(subtaskId) =>
            taskOps.toggleSubtask(selectedTask.id, subtaskId)
          }
          onAddSubtask={(title) => taskOps.addSubtask(selectedTask.id, title)}
          onDeleteSubtask={taskOps.handleDeleteSubtask}
          onFollowPlanet={() => handleFollowPlanet(selectedTask)}
        />
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          formTitle={taskOps.formTitle}
          formDesc={taskOps.formDesc}
          formPriority={taskOps.formPriority}
          formComplexity={taskOps.formComplexity}
          formDueDate={taskOps.formDueDate}
          formColor={taskOps.formColor}
          setFormTitle={taskOps.setFormTitle}
          setFormDesc={taskOps.setFormDesc}
          setFormPriority={taskOps.setFormPriority}
          setFormComplexity={taskOps.setFormComplexity}
          setFormDueDate={taskOps.setFormDueDate}
          setFormColor={taskOps.setFormColor}
          onSubmit={() => taskOps.createTask()}
          loading={taskOps.creating}
        />
      )}

      <footer className={`nasa-footer ${uiHidden ? "ui-hidden" : ""}`}>
        <div className="footer-content">
          <strong style={{ color: "var(--accent-1)" }}>LIGHT FOCUS</strong> —
          Bullseye Task Manager v{info.version}
        </div>
      </footer>
    </>
  );
}
