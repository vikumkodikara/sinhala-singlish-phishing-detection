export interface DetectedFeatures {
  url_count: number;
  url_length: number;
  subdomain_count: number;
  digit_count: number;
  exclamation_count: number;
  question_count: number;
  text_length: number;
  word_count: number;
  suspicious_word_count: number;
}

export interface PredictResponse {
  prediction: 'PHISHING' | 'SAFE';
  probability: number;
  confidence: number;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  detected_script: string;
  preprocessed_text: string;
  detected_features: DetectedFeatures;
  warning?: string | null;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name: string;
  version: string;
  vocab_size: number;
  max_sequence_length: number;
  num_features: number;
}

export interface SampleMessage {
  id: string;
  label: 'PHISHING' | 'SAFE';
  language: string;
  text: string;
  description: string;
}

export interface ModelInfoResponse {
  model_name: string;
  architecture: string;
  framework: string;
  max_sequence_length: number;
  vocabulary_size: number;
  handcrafted_features: string[];
  dataset: {
    total_records: number;
    synthetic_records: number;
    real_messages: number;
    classes: string[];
    train_split: string;
    val_split: string;
    test_split: string;
  };
  benchmarks: {
    synthetic_heavy_random_split: {
      description: string;
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      roc_auc: number;
      confusion_matrix: {
        tn: number;
        fp: number;
        fn: number;
        tp: number;
      };
      note: string;
    };
    real_world_message_audit: {
      description: string;
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      roc_auc: number;
      confusion_matrix: {
        safe_correct: number;
        safe_missed: number;
        phishing_correct: number;
        phishing_missed: number;
      };
      note: string;
    };
  };
  disclaimer: string;
}
