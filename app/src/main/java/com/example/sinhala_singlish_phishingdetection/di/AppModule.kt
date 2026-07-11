package com.example.sinhala_singlish_phishingdetection.di

/**
 * Hilt Dependency Injection Module.
 *
 * Provides singleton and scoped instances for the application's
 * dependency graph:
 *
 * - **Database**: [PhishingDatabase] and DAOs
 * - **Repositories**: [DetectionRepositoryImpl], [HistoryRepositoryImpl]
 * - **Use Cases**: [AnalyzeMessageUseCase], [GetHistoryUseCase]
 * - **ML Components**: [ModelLoader], [Predictor], [Tokenizer]
 *
 * ## Setup Required
 * 1. Add Hilt dependencies to `build.gradle.kts`
 * 2. Add `@HiltAndroidApp` to the Application class
 * 3. Add `@AndroidEntryPoint` to MainActivity
 * 4. Uncomment the annotations below
 *
 * TODO: Add @Module annotation
 * TODO: Add @InstallIn(SingletonComponent::class) annotation
 */
object AppModule {

    // TODO: Uncomment and configure when dependencies are added
    //
    // @Provides
    // @Singleton
    // fun providePhishingDatabase(@ApplicationContext context: Context): PhishingDatabase {
    //     return Room.databaseBuilder(
    //         context,
    //         PhishingDatabase::class.java,
    //         PhishingDatabase.DATABASE_NAME,
    //     ).fallbackToDestructiveMigration()
    //      .build()
    // }
    //
    // @Provides
    // @Singleton
    // fun provideDetectionDao(database: PhishingDatabase): DetectionDao {
    //     return database.detectionDao()
    // }
    //
    // @Provides
    // @Singleton
    // fun provideModelLoader(@ApplicationContext context: Context): ModelLoader {
    //     return ModelLoader(context)
    // }
    //
    // @Provides
    // @Singleton
    // fun provideTokenizer(@ApplicationContext context: Context): Tokenizer {
    //     return Tokenizer(context)
    // }
    //
    // @Provides
    // @Singleton
    // fun providePredictor(modelLoader: ModelLoader, tokenizer: Tokenizer): Predictor {
    //     return Predictor(modelLoader, tokenizer)
    // }
    //
    // @Provides
    // @Singleton
    // fun provideDetectionRepository(predictor: Predictor): DetectionRepository {
    //     return DetectionRepositoryImpl(predictor)
    // }
    //
    // @Provides
    // @Singleton
    // fun provideHistoryRepository(): HistoryRepository {
    //     return HistoryRepositoryImpl()
    // }
    //
    // @Provides
    // fun provideAnalyzeMessageUseCase(repository: DetectionRepository): AnalyzeMessageUseCase {
    //     return AnalyzeMessageUseCase(repository)
    // }
    //
    // @Provides
    // fun provideGetHistoryUseCase(repository: HistoryRepository): GetHistoryUseCase {
    //     return GetHistoryUseCase(repository)
    // }
}
