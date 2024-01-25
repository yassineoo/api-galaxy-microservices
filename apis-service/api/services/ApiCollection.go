package services

import (
	"context"
	"local_packages/models"
)

func (s *Service) CreateCollection(ctx context.Context, collectionName, description string) (*models.ApiCollectionEntity, error) {
    newCollection := models.ApiCollectionEntity{
        Name:        collectionName,
        Description: description,
    }

    if err := s.gormDB.Create(&newCollection).Error; err != nil {
        return nil, err
    }
    return &newCollection, nil
}


func (s *Service) AddToCollection(ctx context.Context, collectionID int, apiIDs []int) error {
    var collection models.ApiCollectionEntity
    if err := s.gormDB.First(&collection, collectionID).Error; err != nil {
        return err
    }

    for _, apiID := range apiIDs {
        var api models.ApiEntity
        if err := s.gormDB.First(&api, apiID).Error; err != nil {
            return err
        }
        collection.Apis = append(collection.Apis, api)
    }

    return s.gormDB.Save(&collection).Error
}


func (s *Service) GetCollections(ctx context.Context) ([]models.ApiCollectionEntity, error) {
    var collections []models.ApiCollectionEntity
    if err := s.gormDB.Preload("Apis").Find(&collections).Error; err != nil {
        return nil, err
    }
    return collections, nil
}



func (s *Service) UpdateCollection(ctx context.Context, collectionID int, newName, newDescription string) (*models.ApiCollectionEntity, error) {
    var collection models.ApiCollectionEntity
    if err := s.gormDB.First(&collection, collectionID).Error; err != nil {
        return nil, err
    }

    collection.Name = newName
    collection.Description = newDescription

    if err := s.gormDB.Save(&collection).Error; err != nil {
        return nil, err
    }
    return &collection, nil
}


func (s *Service) DeleteCollection(ctx context.Context, collectionID int) error {
    return s.gormDB.Delete(&models.ApiCollectionEntity{}, collectionID).Error
}



func (s *Service) RemoveFromCollection(ctx context.Context, collectionID int, apiIDs []int) error {
    var collection models.ApiCollectionEntity
    if err := s.gormDB.Preload("Apis").First(&collection, collectionID).Error; err != nil {
        return err
    }

    // Filter out the APIs to be removed
    var updatedAPIs []models.ApiEntity
    for _, api := range collection.Apis {
        shouldRemove := false
        for _, apiID := range apiIDs {
            if api.ID == apiID {
                shouldRemove = true
                break
            }
        }
        if !shouldRemove {
            updatedAPIs = append(updatedAPIs, api)
        }
    }

    collection.Apis = updatedAPIs
    return s.gormDB.Save(&collection).Error
}
