class LlmChatModelHelper {
  constructor() {
    this.cleanUpListeners = new Map();
  }

  async initialize(model, onDone) {
    try {
      const session = {
        engine: await this.loadModel(model.path),
        options: {
          topK: model.topK,
          topP: model.topP,
          temperature: model.temperature,
          enableVision: model.llmSupportImage,
        },
      };
      model.instance = { session };
      onDone("");
    } catch (err) {
      onDone(`Error: ${err.message}`);
    }
  }

  async loadModel(path) {
    // Replace this with a real model loader
    return {
      run: async (input, options) => {
        return `This is a response for: "${input}"`; // mock response
      },
    };
  }

  resetSession(model) {
    const instance = model.instance;
    if (!instance) return;

    const { session } = instance;
    model.instance = { session };
    console.log("Session reset.");
  }

  cleanUp(model) {
    if (!model.instance) return;
    this.cleanUpListeners.delete(model.name);
    model.instance = null;
    console.log("Cleaned up model.");
  }

  async runInference(model, input, resultListener, cleanUpListener) {
    const instance = model.instance;
    if (!instance) return;

    if (!this.cleanUpListeners.has(model.name)) {
      this.cleanUpListeners.set(model.name, cleanUpListener);
    }

    try {
      const response = await instance.session.engine.run(input, instance.session.options);
      resultListener(response, true);
    } catch (err) {
      resultListener(`Error: ${err.message}`, true);
    }
  }
}
