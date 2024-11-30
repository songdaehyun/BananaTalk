package com.dhsong.bananatalk.persistence;

import com.dhsong.bananatalk.model.FriendEntity;
import com.dhsong.bananatalk.model.FriendshipStatus;
import com.dhsong.bananatalk.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRepository extends JpaRepository<FriendEntity, Long> {
    //JPQL ??
    @Query("SELECT f.friend FROM FriendEntity f WHERE f.user.id = :userId AND f.status = :status")
    List<UserEntity> findFriendsByUserIdAndStatus(@Param("userId") String userId, @Param("status") FriendshipStatus status);

    @Query("SELECT f FROM FriendEntity f WHERE f.user = :from AND f.friend = :to")
    FriendEntity findByUserAndUser(@Param("from") UserEntity from, @Param("to") UserEntity to);
}
